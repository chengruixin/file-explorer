import fetch from 'node-fetch';

void async function() {
    const response = await fetch('https://www.busdmm.cam/');
    const body = await response.text();

    console.log(body);
}()