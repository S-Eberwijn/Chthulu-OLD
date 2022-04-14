
const fetch = require('node-fetch');
const { url } = require('inspector');
const { URLSearchParams } = require('url');

const passport = require('passport');


exports.loginPage = async (req, res) => {
    const bot = require('../../index');
    // // console.log(req.session.lastVisitedPage)
    // const { code } = req.query;

    // if (code) {
    //     try {
    //         // Add the parameters
    //         const params = new URLSearchParams();
    //         params.append('client_id', process.env.OATH2_CLIENT_ID);
    //         params.append('client_secret', process.env.OATH2_CLIENT_SECRET);
    //         params.append('grant_type', 'authorization_code');
    //         params.append('code', code);
    //         params.append('redirect_uri', `http://localhost:${process.env.WB_PORT}/login`);
    //         params.append('scope', 'identify');


    //         // Send the request
    //         await fetch('https://discord.com/api/oauth2/token', {
    //             method: 'post',
    //             body: params,
    //             headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
    //         }).then(r => r.json()).then(async oauthResult => {
    //             const oauthData = oauthResult;
    //             console.log(oauthData)
    //             // Get user info
    //             const userResult = await fetch('https://discord.com/api/users/@me', {
    //                 headers: {
    //                     authorization: `${oauthData.token_type} ${oauthData.access_token}`,
    //                 },
    //             });
    //             // console.log(await userResult.json())
    //             const { id } = await userResult.json()
    //             req.session.loggedInUserID = id;
    //             // console.log(req.session.loggedInUserID)
    //         });
    //     } catch (error) {
    //         // NOTE: An unauthorized token will not throw an error;
    //         // it will return a 401 Unauthorized response in the try block above
    //         console.error(error);
    //     }
    // }
    // res.redirect(`http://localhost:${process.env.WB_PORT}${req.session.lastVisitedPage || ''}`);

}