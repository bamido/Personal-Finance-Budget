const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const {engine} = require('express-handlebars');
const dbConfig = require('./config/configurations');
const flash = require('connect-flash');
const session = require('express-session');
const {globalVariables} = require('./config/configurations');
const fleupload = require("express-fileupload");
const methodOverride = require('method-override');
const hb = require('express-handlebars');
const passport = require('passport');

const app = express();


// configure express
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

/* flash and session */
app.use(session({
    secret: 'mynoder',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.authenticate('session'));

app.use(flash());
app.use(dbConfig.globalVariables);

// setup view engine to use handlebars
app.set('view engine', 'handlebars');
//Sets handlebars configurations 
app.engine('handlebars', engine({
    helpers: {
        dateFormat:require('handlebars-dateformat'),
        inc: function(value, options)
        {
            return parseInt(value) + 1;
        },
        isSelected: function (value, key) {
            return value === key ? 'selected' : ''; 
        },
        isChecked: function (value, key) {
            return value === key ? 'checked' : ''; 
        },
        isPublished: function (value) {
            //return value === key ? true : false; 
            if(value === 'publish'){
                return 'success';
            }else if(value === 'pending'){
                return 'warning';
            }else{
                return 'danger'
            }
        },
        trimString: function (passedString, startstring, endstring) {
            var regex = /(<([^>]+)>)/ig;
            var newstring = passedString.toString().replace(regex, "");

            var theString = newstring.substring(startstring, endstring);
            if( newstring.length > endstring ) {
                theString += '...';
              }
            return theString;
        },
        isDocType: function (value,key) {
            return value === key ? true : false; 
            
        }
    },
    defaultLayout: 'default'
}));

/* method override middleware */
app.use(methodOverride('newMethod'));

app.use(fleupload());

// require route files
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');
const rbacRoutes = require('./routes/rbacRoutes');
const pageRoutes = require('./routes/pageRoutes');
const postRoutes = require('./routes/postRoutes');

//Use and define base path
app.use('/', defaultRoutes);
app.use('/', pageRoutes);
app.use('/', postRoutes);


app.get('/portal/home', adminRoutes);
app.get('/roles', adminRoutes);
app.get('/roles/create', adminRoutes);
app.post('/roles/create', adminRoutes);
app.get('/roles/edit/:roleid', adminRoutes);
app.put('/roles/edit/:roleid', adminRoutes);
app.delete('/roles/delete/:roleid', adminRoutes);

app.get('/modules', rbacRoutes);
app.get('/modules/create', rbacRoutes);
app.post('/modules/create', rbacRoutes);
app.get('/modules/edit/:moduleid', rbacRoutes);
app.put('/modules/edit/:moduleid', rbacRoutes);
app.delete('/modules/delete/:moduleid', rbacRoutes);

app.get('/tasks', rbacRoutes);
app.get('/tasks/create', rbacRoutes);
app.post('/tasks/create', rbacRoutes);
app.get('/tasks/edit/:taskid', rbacRoutes);
app.put('/tasks/edit/:taskid', rbacRoutes);
app.delete('/tasks/delete/:taskid', rbacRoutes);

app.get('/privileges/assign/:roleid', rbacRoutes);
app.post('/privileges/assign/:roleid', rbacRoutes);


app.listen(3000, ()=>{
    console.log(`Server is running on port: 3000`);
});