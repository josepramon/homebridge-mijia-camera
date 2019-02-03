const MijiaCamera = require('./devices/MijiaCamera')

let Service, Characteristic

module.exports = function (homebridge) {
  Service = homebridge.hap.Service
  Characteristic = homebridge.hap.Characteristic

  homebridge.registerAccessory('homebridge-mijia-camera', 'MijiaCamera', MijiaCameraAccessory)
}
class MijiaCameraAccessory {
  constructor (log, config) {
    this.log = log

    this.device = new MijiaCamera(config, this.log)
    this.serviceInfo = this.createServiceInfo()
    this.cameraPowerToggleService = this.createToggleService()

  }

  createServiceInfo () {
    const serviceInfo = new Service.AccessoryInformation()
    const { Manufacturer, Model, SerialNumber } = Characteristic

    serviceInfo
      .setCharacteristic(Manufacturer, MijiaCamera.manufacturer)
      .setCharacteristic(Model, MijiaCamera.model)
      .setCharacteristic(SerialNumber, MijiaCamera.serialNumber)

    return serviceInfo
  }

  createToggleService () {
    const getCameraStatus = function (callback) {
      this.device.getPowerState()
        .then(status => {
          const power = status[0];
          this.log(`current power state: ${power}`)
          callback(null, power === 'on')
        })
        .catch(callback)
    }

    const setCameraStatus = function (state, callback) {
      this.log(`set power state to ${state}`)
      this.device.setPowerState(state)
        .then(() => {
          callback(null)
        })
        .catch(callback)
    }

    const service = new Service.Switch(this.device.name)

    service.getCharacteristic(Characteristic.On)
      .on('get', getCameraStatus.bind(this))
      .on('set', setCameraStatus.bind(this))

    return service
  }

  identify (callback) {
    callback()
  }

  getServices () {
    return [this.serviceInfo, this.cameraPowerToggleService]
  }
}
