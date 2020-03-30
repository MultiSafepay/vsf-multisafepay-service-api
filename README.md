<p align="center">
  <img src="https://www.multisafepay.com/img/multisafepaylogo.svg" width="400px" position="center">
</p>

# Vue Storefront API extension for MultiSafepay Payment Service module

Vue Storefront API extension to communicate with the MultiSafepay Payments API and Magento 2. This extension is tested on Vue Storefront API 1.11.0.

## About MultiSafepay

MultiSafepay is a collecting payment service provider which means we take care of the agreements, technical details and payment collection required for each payment method. You can start selling online today and manage all your transactions from one place.

# Installation Guide

Follow these steps to install this API extenstion to the Vue Storefront API.

## Requirements

Clone this git repository from within your vue-storefront-api root folder

```shell
git clone git@github.com:MultiSafepay/vsf-multisafepay-service-api.git src/api/extensions/vsf-multisafepay-service-api
```

**Run yarn to install dependencies**

# Register the Vue Storefront API extension

Add the API extension to the registered extensions to `local/config.json`

```json
"registeredExtensions": [
  ...,
 "vsf-multisafepay-service-api"
]
```

Andd add the MultiSafepay settings

TEST API

https://testapi.multisafepay.com/v1/json

LIVE API

https://api.multisafepay.com/v1/json

```json
"extensions": {
  ,,,
  "multisafepay": {
    "api_key": "YOUR_MULTISAFEPAY_API_KEY",
    "api_url": "https://api.multisafepay.com/v1/json"
  }
}

```

# Support

If you have any issues, problems or questions you can create an issue on this repository or contact us at <a href="mailto:integrationt@multisafepay.com">integration@multisafepay.com</a>

# Thanks to Lakefields

Thanks to Lakefields as this project is based on their [integration](https://github.com/Lakefields/vsf-payment-service-api). :heart:

# License

[MIT License](https://github.com/MultiSafepay/vsf-multisafepay-service-api/blob/master/LICENSE)

# Want to be part of the team?

Are you a developer interested in working at MultiSafepay? [View](https://www.multisafepay.com/careers/#jobopenings) our job openings and feel free to get in touch with us.
