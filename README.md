# gunjstrustsharekey

# Create by: Lightnet

# Credit:
 * Amark (https://github.com/amark/gun)

# License: MIT

# Information:
 This is just helper share key setup call functions. To grant and revoke users access.
 As wel put encrypt and decrypt key value as well other users. To learn how SEA.js 
 (Security Encryption Authorization ) that works with gun.js.

 * https://gun.eco/docs/SEA
 
Working Javascript: 
 * Nodejs (Not working atm)
 * Browser (Working)

# Features: 
```
User / Gun:
 - function grantkey (to allow owner user access to key graph value for other users. Check and create salt keys)
 - function revokekey (to owner revoke user access to key graph for user. Note it will break salt key if share with other users.)
  - Recreate new slat key and reencrypt value.(This break other salt keys are shared.)
 - function encryptput put value (allow owner user to encrypt key value when creating and check salt key)
 - function decryptvalue return value (allow owner user to decrypt key value)
 - function decryptdata (to allow other user to decrypt key value/data from gun or sea but not self)
  - `let to = gun.user(public key)`
```

# To Do List:
 * Work on debug logging.
 * Finish and Docs.
 * Clean Up script.