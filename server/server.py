
from authlib.integrations.flask_client import OAuth
from flask import Flask, jsonify, request, session, url_for, redirect
from urllib.parse import quote_plus, urlencode

from collections import defaultdict


AUTH0_CLIENTID="4yDcL1LUGClyovqvwwlXsgq5AIuru0eE"
AUTH0_CLIENTSEC="WSJFiGsqktQ5y19bOC2sR_arUq9zw_4iSHYZpv539KuIDCVE8C7tbsQB4F50ElCq" # this is *really* bad opsec but its 1am
AUTH0_DOMAIN="dev-bvbzz75dggv2auge.us.auth0.com"
THIS="https://us.openport.io:14983/"

app = Flask(__name__)
app.secret_key = "WSJFiGsqktQ5y19bOC2sR_arUq9zw_4iSHYZpv539KuIDCVE8C7tbsQB4F50ElCq"

state = {} # "userid (string) -mapsto-> [buildingno (int), lastupdated (int)]

oauth = OAuth(app)

oauth.register(
    "auth0",
    client_id=AUTH0_CLIENTID,
    client_secret=AUTH0_CLIENTSEC,
    client_kwargs={
        "scope": "openid profile email",
    },
    server_metadata_url=f'https://{AUTH0_DOMAIN}/.well-known/openid-configuration',
)


# User requests for everyone's locations
@app.route('/api/fetch')
def fetchstate():

    
    def invert_dict(original_dict):
        inverted_dict = defaultdict(list)
        for key, value in original_dict.items():
            inverted_dict[value[0]].append([key, value[0]])
        return dict(inverted_dict)

    return jsonify(invert_dict(state))


# user updates their state
@app.route('/api/log', methods=["POST"])
def log():
    print(session)
    uid = session["user"]["userinfo"]["name"]
    state[uid] = request.get_json()
    return "200 OK"

# embb stuff (nokia please fix your api)
@app.route('/api/embb/activate')
def activate_embb():
    # see `network.py`
    # alloc(request.cookie.get("userid"))
    pass

@app.route('/api/embb/deactivate')
def deactivate_embb():
    # see `network.py`
    # dealloc(request.cookie.get("userid"))
    pass


@app.route('/api/embb/hook', methods=["POST"])
def embb_hook():
    print(request.get_json())
    # this is dummy data anyway
    return "yes"

@app.route('/')
def root():
    if "user" not in session:
        return redirect("/login")
    return redirect('/Loading_Page.html}')

# static file server (there's gotta be a better way to do this)
@app.route('/<filename>')
def index(filename):

    if "user" not in session:
        return redirect("/login")

    try:
        try:
            with open("../frontend/"+filename, "r") as f:
                r = f.read()
                r = r.replace("%%USERNAME%%", session["user"]["userinfo"]["name"])
                return r
        except:
            with open("../frontend/"+filename, "rb") as f:
                return f.read()
    except Exception as e:
        print(e)
        return "404 not found"




# Auth0 stuff
@app.route("/callback", methods=["GET", "POST"])
def callback():
    token = oauth.auth0.authorize_access_token()
    session["user"] = token
    return redirect("/dummy.html")

@app.route("/login")
def login():
    return oauth.auth0.authorize_redirect(
        redirect_uri=url_for("callback", _external=True)
    )

@app.route("/logout")
def logout():

    session.clear()
    return redirect(
        "https://"
        + AUTH0_DOMAIN
        + "/v2/logout?"
        + urlencode(
            {
                "returnTo": THIS+"dummy.html",
                "client_id": AUTH0_CLIENTID,
            },
            quote_via=quote_plus,
        )
    )

if __name__ == '__main__':  
     import os
     os.system("flask --app server.py run --host 0.0.0.0 --port 8888")#--cert adhoc")