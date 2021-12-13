import {string, object} from 'yup'; 

export const userSchema = object({
    body : object({
        username : string().required('Username is required'), 
        password: string().required('Password is required'), 
        email: string().email('Most be a valid email').required('Email is required')
    })
})