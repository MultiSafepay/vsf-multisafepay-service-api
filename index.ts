// @ts-check

import { apiStatus } from "../../../lib/util";
import { Router } from "express";
import bodyParser from "body-parser";
import axios from "axios";

const Magento2Client = require("magento2-rest-client").Magento2Client;

module.exports = ({ config }) => {
	let api = Router();

	axios.defaults.baseURL = config.extensions.multisafepay.api_url;
	axios.defaults.headers.api_key = config.extensions.multisafepay.api_key;
	
	api.use(
		bodyParser.urlencoded({
			extended: true
		})
		);
		api.get("/payment-methods", async (req, res) => {
			try {
				const response = await axios.get("/gateways");
				apiStatus(res, response.data, response.status);
			} catch (error) {
				console.error(error);
				apiStatus(res, error, 500);
			}
		});

	api.get("/fetch-issuers", async (_req, res) => {
		try {
			const response = await axios.get("/issuers/ideal");
			apiStatus(res, response.data, response.status);
		} catch (error) {
			console.error(error);
			apiStatus(res, error, error.response.status);
		}
	});

	api.post("/post-payment", async (req, res) => {
		const params = req.body;

		const client = Magento2Client(config.magento2.api);

		client.addMethods("order", function(restClient) {
			let module:any = {};
			module.getSingleOrder = function() {
				return restClient.get(`/orders/${params.order_id}`);
			};
			return module;
		});

		try {
			const result = await client.order.getSingleOrder();

			const amount = result.grand_total.toFixed(2).replace(/\./, "");

			let order = {
				type: "redirect",
				order_id: params.order_id,
				gateway: params.method,
				currency: params.currency,
				amount: amount,
				description: params.description,
				payment_options: {
					redirect_url: params.redirectUrl
				},
				customer: {
					ip_address: result.remote_ip,
					first_name: result.customer_firstname,
					last_name: result.customer_lastname,
					address1: result.billing_address.street[1],
					house_number: result.billing_address.street[0],
					zip_code: result.billing_address.postcode,
					city: result.billing_address.city,
					country: result.billing_address.country_id,
					phone: result.billing_address.telephone,
					email: result.customer_email
				}
			};
			if (params.hasOwnProperty("issuer")) {
				order["gateway_info"] = {
					issuer_id: params.issuer
				};
				order["type"] = "direct";
			}

			const response = await axios.post("/orders", order);
			const dataToSend = {
				order_id: response.data.data.order_id,
				amount: amount,
				payment_gateway_url: response.data.data.payment_url
			};
			apiStatus(res, dataToSend, response.status);
		} catch (error) {
			console.error(error);
			apiStatus(res, error, error.response.status);
		}
	});

	api.post("/order-comments", async (req, res) => {
		const client = Magento2Client(config.magento2.api);
		client.addMethods("orderComment", function(restClient) {
			let module:any = {};
			module.postOrderComment = function() {
				return restClient.post(
					`/orders/${req.body.order_id}/comments`,
					req.body.order_comment
				);
			};
			return module;
		});

		try {
			const result = client.orderComment.postOrderComment();
			apiStatus(res, result, result.status);
		} catch (error) {
			console.error(error);
			apiStatus(res, error, error.response.status);
		}
	});

	api.post("/get-payment-status", async (req, res) => {
		try {
			const order_id = req.body.order_id;

			const client = Magento2Client(config.magento2.api);
			client.addMethods("order", function(restClient) {
				let module:any = {};
				module.getSingleOrder = function() {
					return restClient.get(`/orders/${order_id}`);
				};
				return module;
			});

			const orderDetails = await client.order.getSingleOrder();

			const response = await axios.get(`/orders/${order_id}`);
			const result = {
				payment: {
					status: response.data.data.status
				},
				order: {
					increment_id: orderDetails.increment_id,
					customer_email: orderDetails.customer_email
				}
			};
			apiStatus(res, result, response.status);
		} catch (error) {
			console.error(error);
			apiStatus(res, error, error.response.status);
		}
	});

	return api;
};
