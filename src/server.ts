import express from 'express'
import { Client } from 'ldapts';

const app = express()

const url = 'ldap://example.com.br:389';
const bindDN = 'cn=User Name,cn=Users,dc=example,dc=com,dc=br';
const password = 'password';
const searchDN = 'dc=example,dc=com,dc=br';

const client = new Client({
  url,
});

let isAuthenticated;

app.use(express.json())

app.get('/auth', async (request, response) => {
  try {
    await client.bind(bindDN, password);
    
    isAuthenticated = true;

    const { searchEntries } = await client.search(searchDN, {
      scope: 'sub',
      filter: '(mail=example@email.com.br)',
    });

    return response.json([
      { authenticate: searchEntries },
      { isAuthenticated: isAuthenticated }
    ])
  } catch (ex) {
    isAuthenticated = false;

    console.log(ex)
    console.log('isAuthenticated: ', isAuthenticated)
  } finally {
    await client.unbind();
  }
})

app.listen(4444, () => console.log("API Started."))