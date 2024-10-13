# defines the nokia geolocation api helpers

import network_as_code as nac
 
from network_as_code.models.device import DeviceIpv4Addr
 
# We initialize the client object
client = nac.NetworkAsCodeClient(
    token="07e94ed89dmshf2b4ff99501845cp11c33fjsn6157ff6d58a5"
)

def to_device(phone_number):
	my_device = client.devices.get(phone_number=phone_number)

# use `to_device(phone_number).location()` to use.
# currently uses the browser's `navigator.geolocation` 
# since the dummy data is defunct.