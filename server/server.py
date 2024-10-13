from flask import Flask, jsonify, request

app = Flask(__name__)

state = {} # "userid (string) -mapsto-> [buildingno (int), lastupdated (int)]


@app.route('/api/fetch')
def fetchstate():
	# User requests for everyone's locations

	inv_map = {}
	for k, v in state.items():
	    inv_map[v] = inv_map.get(v, []) + [k]

	return jsonify(inv_map)


@app.route('/api/signup/', methods=["POST"])
def adduser():
	# User sends their info to enable T-Mobile eMBB and Nokia geolocation

	data = request.get_json()
	user_location = data["phone_number"]


@app.route('/api/log')
def log():
	uid = request.cookie.get("userid") # really bad opsec
	state[uid] = request.get_json()
	return "200 OK"


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


# static file server (there's gotta be a better way to do this)
@app.route('/<filename>')
def index(filename):
	try:
		with open(filename, "rb") as f:
			return f.read()
	except Exception as e:
		print(e)
		return "404 not found"


if __name__ == '__main__':  
     import os
     os.system("flask --app server.py run --host 0.0.0.0 --port 8888 --cert adhoc")