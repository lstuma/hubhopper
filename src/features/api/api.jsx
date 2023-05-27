import { getRecoil } from "recoil-nexus";
import {passengerFlowState} from "../../state";

const users = [
    ['hkleinber3s@ucoz.ru', 'password'],
    ['nbroggiorm@mail.ru', 'password'],
]

function authorize(email = users[0][0], password = users[0][1])
{
    // base64 encoded basic auth username:password@web.site
    console.log(getRecoil(passengerFlowState))
    var creds = btoa(email + ":" + password)
    return "Basic " + creds
}

export async function post(path, body) {
    let request = await fetch("https://api.hubhopper.app"+path, {
        method: "POST",
        mode: "cors",

        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",

            "Authorization": authorize()
        }
    });
    return await request.json()
}
export async function get(path) {
    let request = await fetch("https://api.hubhopper.app"+path, {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": authorize()
        }
    });
    return await request.json()
}

export async function get_hubs() {
    const data = JSON.parse(await get('/get_hubs/'));
    // console.log(data)
    return data.map(data => ({
        loc: [data.fields.latitude, data.fields.longitude],
        address: data.fields.info,
        id: data.pk
    }))
}
export async function find_rides(destination_hub_id, source_hub_id) {
    const data1 = await post('/find-rides/', {'destination_hub_id':destination_hub_id, 'source_hub_id':source_hub_id})
    console.log(data1)
    // const data = JSON.parse(data1)
    // console.log(data)
    return data1.map(data => ({
        id: data.pk,
        points: data.fields.points,
        driver: data.fields.driver,
    }))
}
export async function create_ride({ destination_hub_id, source_hub_id }) {
    const data = await post('/create-ride/', {'destination_hub_id':destination_hub_id, 'source_hub_id':source_hub_id})
    return JSON.parse(data.ride)
}
export async function join_request(ride_id, source_hub_id) {
    return await post('/request-join-ride/', {'ride_id':ride_id, 'passenger_hub_id':source_hub_id})
}
export async function accept_join_request(ride_id, passenger_id) {
    return await post('/request-join-ride/', {'ride_id':ride_id, 'passenger_id':passenger_id})
}
export async function cancel_ride(ride_id) {
    return await post('/request-join-ride/', {'ride_id':ride_id})
}
export async function finish_ride(ride_id) {
    return await post('/request-join-ride/', {'ride_id':ride_id})
}
export async function update() {
    return await get('/update/')
}

