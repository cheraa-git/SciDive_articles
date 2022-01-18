import axiosApp from "../../axios/axiosApp";
import { userActions } from "../../types/UserTypes";
import { LOGIN_USER } from "../actionTypes";


export const authDataPost = ( data: Object, ownProps?: any ) => {
  return async (dispatch: any,  )=> {

      await axiosApp.post("authorization/log_in", data )
          .then( res => {
              if( res.data.error ) {
                  // dispatch( logErrorMassage("неверный пароль или имя") )
                  console.log('Неверный логин или пароль')
                  console.log('Неверный логин или пароль')
              } else if ( !res.data.error ) {
                  console.log("auth data", res.data)
                  // dispatch( logErrorMassage(null) )
                  // dispatch( loginUser(res.data.avatar) )
                  
                  
                  // ownProps.history.push("/")
                  // dispatch(push("/"))

                  const expirationDate = new Date( new Date().getTime() + 3600000 )

                  // localStorage.setItem("token", res.data.token)
                  // localStorage.setItem("expirationDate", expirationDate)

                  // localStorage.setItem("userName", data.login )

                  // localStorage.setItem("userAvatar", res.data.avatar )



                  // dispatch( setAdminMod( res.data.admin ) )

                  
                  // const expirationDate = new Date( new Date().getTime() + data.expiresIn * 1000 )
                  // localStorage.setItem("expirationDate", expirationDate)
              }
          })
          .catch(function (error) {
              console.log(error);
            });
  }
}

export function loginUser (userAvatar: string) {
  return {
      type: LOGIN_USER,
      userAvatar
  }
}