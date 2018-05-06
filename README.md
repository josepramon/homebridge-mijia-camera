# homebridge-mijia-camera

[Homebridge](https://github.com/nfarina/homebridge) plugin for the *Xiaomi Mijia 1080P Smart IP Camera*, also known as [*Mi Home Security Camera*](https://www.mi.com/us/mi-home-security-camera).

For now the plugin only allows turning on and off the camera.

## Installation

1. Install the package:

    ```
    npm install -g homebridge-mijia-camera
    ```

2. Get the IP and token of the camera

    See [this](http://forum.smartapfel.de/forum/thread/370-xiaomi-token-auslesen/?postID=7021#post7021) or [this](https://github.com/aholstenson/miio/issues/40) for instructions.

3. Update the Homebridge configuration:

    Add the camera configuration to the `accessories` node, with the appropriate values.

    ```
    "accessories": [
      {
        "accessory": "MijiaCamera",
        "name": "SOME_NAME_FOR_THE_CAMERA",
        "ip": "IP_ADDRESS_OF_THE_CAMERA",
        "token": "CAMERA_TOKEN"
      }
    ]
    ```

  4. Restart Homebridge
