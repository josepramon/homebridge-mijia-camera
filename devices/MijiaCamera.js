const miio = require('miio')

class MijiaCamera {
  constructor (config, log) {
    const { name, ip, token } = config
    if (!ip || !token) {
      throw new Error('The camera IP address and token are required')
    }
    this.log = log;
    Object.assign(this, { name, ip, token })
  }

  async connect () {
    const { ip: address, token } = this

    this.log(`connecting to camera at ${address}...`)

    return miio.device({ address, token });

    // this.device = device
  }

  async getPowerState () {

    try {
      const device = await this.connect()
      return device.call('get_prop', ['power'])
    } catch (err) {
      this.log.error('Camera not available')
      throw (new Error('Camera not available', err))
    }
    
  }

  async setPowerState (state) {

    try {
      const device = await this.connect()
      device.call('set_power', [state ? 'on' : 'off'])
    } catch (err) {
      this.log.error('Camera not available')
      throw (new Error('Camera not available', err))
    }


    
    
  }
}

MijiaCamera.manufacturer = 'Xiaomi'
MijiaCamera.model = 'Mijia Camera'
MijiaCamera.serialNumber = '5cc80bb2-d449-45aa-9c48-ce66eb2d7ac9'

module.exports = MijiaCamera
