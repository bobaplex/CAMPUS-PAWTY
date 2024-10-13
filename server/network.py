# defines the network-slice api helpers

import network_as_code as nac

from network_as_code.models.device import DeviceIpv4Addr

from network_as_code.models.slice import *

import time

# We begin by creating a Network as Code client
client = nac.NetworkAsCodeClient(
    token="07e94ed89dmshf2b4ff99501845cp11c33fjsn6157ff6d58a5"
)


def alloc_call(user):

    # demo code, use `to_device(phone_number[user1])` in production
    device = client.devices.get("9c4db156-382d-4646-9412-6ee9d0392d2e@testcsp.net")

    # demo code, use a "slice"-pool in production
    slice = client.slices.get("main-slice") 

    # wait for slice to be available
    while slice.state not in ("AVAILABLE", "OPERATING"):
        slice.refresh()
        time.sleep(0.2)

    slice.ativate()

    # wait for slice to activate
    while slice.state != "OPERATING":
        slice.refresh()
        time.sleep(0.2)

    # attach the device to the eMBB network
    slice.attach(
        device,
        notification_url="https://0.0.0.0:8888/api/embb_hook", # not implemented, for now
        notification_auth_token="07e94ed89dmshf2b4ff99501845cp11c33fjsn6157ff6d58a5",
    )

def dealloc_call(user):

    slice.deactivate()

    # wait for slice to deactivate/free
    while slice.state != "AVAILABLE":
        slice.refresh()
        time.sleep(0.2)