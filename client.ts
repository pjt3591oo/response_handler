import axios from 'axios';

/*
  rules : {
  }
*/

function apiHandler(rules = {ERROR_CODE_CHECK: ""}) {
  return function (target, property, descriptor) {
    let originMethod = descriptor.value
    
    descriptor.value = async function (...args) {
      let res = {
        status: 200,
        data: {},
        errorCode: false
      }
      try {
        let { status, data } = await originMethod.apply(target, args)
        
        res = {
          status, data,
          errorCode: data[rules.ERROR_CODE_CHECK]
        }

        // 정상응답은 여기서 반환
        // errorCode가 있는 응답은 try ~ catch 밖에서 반환 => exception 발생
        // 여기서 throw 호출할 경우 아래의 catch에서 받음
        if (!res.errorCode) return res
        
      } catch (err) { // 4xx, 5xx는 exception 처리된다.
        
        let { status, data } = err.response
        res = {
          status, data,
          errorCode: data[rules.ERROR_CODE_CHECK]
        }

        throw {
          ...res,
          error: new Error('Error Force Raise By StatusCode')
        };
      }

      if (res.errorCode) {
        throw  {
          ...res,
          error: new Error('Error Force Raise By ErrorCode')
        };
      }
    }
  }
};

class ApiCall {
  static URL: string = 'http://127.0.0.1:3000'

  @apiHandler()
  static async call(path, data) {
    return await axios.get(`${ApiCall.URL}${path}`)
  }

  @apiHandler({
    ERROR_CODE_CHECK: "errorCode1"
  })
  static async callRule(path, data) {
    return await axios.get(`${ApiCall.URL}${path}`)
  }
}

; (async () => {
  console.log('===== No Rules =====')
  try {
    let res = await ApiCall.call('/a', {})
    console.log(res)
  } catch (err) {
    console.log(err)
  }
  
  try {
    let res = await ApiCall.call('/b', {})
    console.log(res)
  } catch (err) {
    console.log(err)
  }
  
  try {
    let res = await ApiCall.call('/c', {})
    console.log(res)
  } catch (err) {
    console.log(err)
  }

  console.log('===== Rules =====')
  try {
    let res = await ApiCall.callRule('/a', {})
    console.log(res)
  } catch (err) {
    console.log(err)
  }
  
  try {
    let res = await ApiCall.callRule('/b', {})
    console.log(res)
  } catch (err) {
    console.log(err)
  }
  
  try {
    let res = await ApiCall.callRule('/c', {})
    console.log(res)
  } catch (err) {
    console.log(err)
  }
})()