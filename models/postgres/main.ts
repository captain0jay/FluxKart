'use strict'

import { main } from '../../configs/postgres.ts'
import knex, { Knex } from 'knex'

const knexPsql: Knex = knex({
  client: 'pg',
  connection: {
    host: main.HOST,
    port: main.PORT,
    user: main.USER,
    password: main.PASSWORD,
    database: main.DATABASE,
    ssl: {
      rejectUnauthorized: false
    },
    application_name: main.APPLICATION_NAME
  },
  pool:{
    max: main.MAX_POOL
  }
})

knexPsql.client.on('query', (query: any) => {
  if (query?.options) query.options.qst = new Date()
})

knexPsql.client.on('query-response', (response: any, query: any) => {
  if (!query?.options?.qst) return
  console.log('DB Query Time', new Date().getTime() - query.options.qst.getTime(), query.sql)
})

knexPsql.client.on('query-error', async (error: any, obj: any) => {
  if (obj?.queryContext?.ignoreAlert) {
    console.error('DB Error, alert suppressed', error, JSON.stringify(obj))
  }
})

export default knexPsql

process.on('uncaughtException', function (error: Error) {
  console.error('[UNHANDLED] uncaughtException', error)
})
