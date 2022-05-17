const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
function initialize(passport, getUserByUsername,getUserById) {

    const authenticateUser = async (username, password, done) => {

        const user = await getUserByUsername(username)
        if (user == null) {
            return done(null, false, {
                message: 'Nėra tokio vartotojo'
            })
        }
        try {
            if(await bcrypt.compare(password, user.password))
            {
                return done(null, user)
            }
            else{
                return done(null, false, {message: 'Neteisingas slaptažodis'})
            }
        } catch (err){
            return done(err)
        }
    }
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => {
        const userById = await getUserById(id)
        return done(null,userById)
    })

    passport.use(new LocalStrategy({
        usernameField: 'username'
    }, authenticateUser))
   
}

module.exports = initialize