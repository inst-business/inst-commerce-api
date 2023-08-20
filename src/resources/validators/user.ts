import express from 'express'
import { GV, GENDER, ACCOUNT_STATUS, ACCOUNT_ROLE } from '@/config/global/const'
import _ from '@/utils/utils'

class UserValidator {

  static login = {
    type: 'object',
    properties: {
      userInfo: { type: 'string' },
      password: { type: 'string' },
    },
    required: ['userInfo', 'password']
  }

  static signup = {
    type: 'object',
    properties: {
      username: { type: 'string', maxLength: 32 },
      email: { type: 'string', format: 'email', maxLength: 50 },
      tel: { type: 'string', maxLength: 20 },
      password: { type: 'string' },
      firstname: { type: 'string', maxLength: 50 },
      lastname: { type: 'string', maxLength: 50 },
      gender: { type: 'string' },
      birthday: { type: ['string', 'null'], format: 'date-time' },
      address: { type: 'string', maxLength: 128 },
      country: { type: 'string', maxLength: 32 },
      bio: { type: 'string' },
      avatar: { type: 'string' },
      cover: { type: 'string' },
      // status: { type: 'string' },
      // role: { type: 'string' },
      // token: { type: 'string' },
      // salt: { type: 'string', maxLength: GV.SALT_LENGTH },
      // verifiedAt: { type: ['string', 'null'], format: 'date-time' },
    },
    required: [
      'username', 'email', 'tel', 'password',
      'firstname', 'lastname', 'gender',
      // 'status', 'role'
    ]
  }

}

export default UserValidator