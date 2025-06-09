const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = require('./keys');

// For demo: in-memory user store
const users = [];

function findOrCreateUser(profile, done) {
  let user = users.find(u => u.id === profile.id);
  if (!user) {
    user = { id: profile.id, username: profile.displayName || profile.emails?.[0]?.value };
    users.push(user);
  }
  return done(null, user);
}

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
(accessToken, refreshToken, profile, done) => {
  findOrCreateUser(profile, done);
}
));

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: "/auth/facebook/callback",
  profileFields: ['id', 'emails', 'name', 'displayName']
},
(accessToken, refreshToken, profile, done) => {
  findOrCreateUser(profile, done);
}
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  done(null, user);
});
