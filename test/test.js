const { authenticate, LdapAuthenticationError } = require('../index.js')

describe('ldap-authentication test', () => {
  it('Use an admin user to authenticate a regular user', async () => {
    let options = {
      ldapOpts: {
        url: 'ldap://ldap.forumsys.com',
      },
      adminDn: 'cn=read-only-admin,dc=example,dc=com',
      adminPassword: 'password',
      userPassword: 'password',
      userSearchBase: 'dc=example,dc=com',
      usernameAttribute: 'uid',
      username: 'gauss',
    }
    let user = await authenticate(options)
    expect(user).toBeTruthy()
    expect(user.uid).toEqual('gauss')
  })
  it('Use an regular user to authenticate iteself', async () => {
    let options = {
      ldapOpts: {
        url: 'ldap://ldap.forumsys.com',
      },
      userDn: 'uid=einstein,dc=example,dc=com',
      userPassword: 'password',
      userSearchBase: 'dc=example,dc=com',
      usernameAttribute: 'uid',
      username: 'einstein',
    }
    let user = await authenticate(options)
    expect(user).toBeTruthy()
    expect(user.uid).toEqual('einstein')
  })
  it('Use an regular user to authenticate iteself without search', async () => {
    let options = {
      ldapOpts: {
        url: 'ldap://ldap.forumsys.com',
      },
      userDn: 'uid=einstein,dc=example,dc=com',
      userPassword: 'password',
    }
    let user = await authenticate(options)
    expect(user).toBeTruthy()
  })
})

describe('ldap-authentication negative test', () => {
  it('wrong admin user should fail', async () => {
    let options = {
      ldapOpts: {
        url: 'ldap://ldap.forumsys.com',
      },
      adminDn: 'cn=not-exist,dc=example,dc=com',
      adminPassword: 'password',
      userPassword: 'password',
      userSearchBase: 'dc=example,dc=com',
      usernameAttribute: 'uid',
      username: 'gauss',
    }
    let e = null
    try {
      await authenticate(options)
    } catch (error) {
      e = error
    }
    expect(e).toBeTruthy()
  })
  it('wrong admin password should fail', async () => {
    let options = {
      ldapOpts: {
        url: 'ldap://ldap.forumsys.com',
      },
      adminDn: 'cn=read-only-admin,dc=example,dc=com',
      adminPassword: '',
      userPassword: 'password',
      userSearchBase: 'dc=example,dc=com',
      usernameAttribute: 'uid',
      username: 'gauss',
    }
    let e = null
    try {
      await authenticate(options)
    } catch (error) {
      e = error
    }
    expect(e).toBeTruthy()
  })
  it('admin auth wrong username should fail', async () => {
    let options = {
      ldapOpts: {
        url: 'ldap://ldap.forumsys.com',
      },
      adminDn: 'cn=read-only-admin,dc=example,dc=com',
      adminPassword: 'password',
      userPassword: 'password',
      userSearchBase: 'dc=example,dc=com',
      usernameAttribute: 'uid',
      username: 'wrong',
    }
    let e = null
    try {
      await authenticate(options)
    } catch (error) {
      e = error
    }
    expect(e).toBeTruthy()
  })
  it('admin auth wrong user password should fail', async () => {
    let options = {
      ldapOpts: {
        url: 'ldap://ldap.forumsys.com',
      },
      adminDn: 'cn=read-only-admin,dc=example,dc=com',
      adminPassword: 'password',
      userPassword: 'wrongpassword',
      userSearchBase: 'dc=example,dc=com',
      usernameAttribute: 'uid',
      username: 'gauss',
    }
    let e = null
    try {
      await authenticate(options)
    } catch (error) {
      e = error
    }
    expect(e).toBeTruthy()
  })
  it('user auth wrong username should fail', async () => {
    let options = {
      ldapOpts: {
        url: 'ldap://ldap.forumsys.com',
      },
      userDn: 'cn=not-exist,dc=example,dc=com',
      userPassword: 'password',
      userSearchBase: 'dc=example,dc=com',
      usernameAttribute: 'uid',
      username: 'gauss',
    }
    let e = null
    try {
      await authenticate(options)
    } catch (error) {
      e = error
    }
    expect(e).toBeTruthy()
  })
  it('user auth wrong user password should fail', async () => {
    let options = {
      ldapOpts: {
        url: 'ldap://ldap.forumsys.com',
      },
      userDn: 'cn=gauss,dc=example,dc=com',
      userPassword: 'wrongpassword',
      userSearchBase: 'dc=example,dc=com',
      usernameAttribute: 'uid',
      username: 'gauss',
    }
    let e = null
    try {
      await authenticate(options)
    } catch (error) {
      e = error
    }
    expect(e).toBeTruthy()
  })
  it('Use an regular user to authenticate iteself without search with wrong password should fail', async () => {
    let options = {
      ldapOpts: {
        url: 'ldap://ldap.forumsys.com',
      },
      userDn: 'uid=einstein,dc=example,dc=com',
      userPassword: '',
    }
    try {
      await authenticate(options)
    } catch (error) {
      e = error
    }
    expect(e).toBeTruthy()
  })
  it('Wrong options give LdapAuthenticationError', async () => {
    let options = {
      ldapOpts: {
        url: 'ldap://ldap.forumsys.com',
      },
      userDn: 'uid=einstein,dc=example,dc=com',
      userPassword: 'password',
      usernameAttribute: 'cn',
      userSearchBase: 'dc=example,dc=com',
      username: 'einstein',
    }
    try {
      await authenticate(options)
    } catch (error) {
      e = error
    }
    expect(e).toBeTruthy()
    expect(e).toBeInstanceOf(LdapAuthenticationError)
  })
  it('Unreachable ldap server should throw error', async () => {
    let options = {
      ldapOpts: {
        url: 'ldap://x.forumsys.com',
        connectTimeout: 2000,
      },
      userDn: 'uid=einstein,dc=example,dc=com',
      userPassword: 'password',
      usernameAttribute: 'cn',
      userSearchBase: 'dc=example,dc=com',
      username: 'einstein',
    }
    try {
      await authenticate(options)
    } catch (error) {
      e = error
    }
    expect(e).toBeTruthy()
  })
})
