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

    this.device.connect().then(() => {
      this.log(`Successfully connected to camera ${config.ip}`)
    }).catch(error => {
      this.log('Error connecting to camera')
      this.log(error)
    })
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
          callback(null, status)
        })
        .catch(callback)
    }

    const setCameraStatus = function (state, callback) {
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
