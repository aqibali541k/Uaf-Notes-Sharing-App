import React from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import ResetPassword from './ResetPassword'
import { useAuthContext } from '../../context/AuthContext'

const Auth = () => {
    // const navigate = useNavigate()
    const { isAuth } = useAuthContext()
    console.log(isAuth)
    if (isAuth) return <Navigate to="/" />
    return (
        <>
            <Routes>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="reset-Password" element={<ResetPassword />} />
                {/* Unknown auth sub-paths fall back to the login form */}
                <Route path="*" element={<Navigate to="/auth/login" replace />} />
            </Routes>
        </>
    )
}

export default Auth