const TronWeb = require('tronweb')

const SERVER_IP = "184.105.216.181"

const HttpProvider = TronWeb.providers.HttpProvider; // This provider is optional, you can just use a url for the nodes instead
const fullNode = new HttpProvider(`http://${SERVER_IP}:8090/`); // Full node http endpoint
const solidityNode = new HttpProvider(`http://${SERVER_IP}:8091/`); // Solidity node http endpoint
const eventServer = `http://${SERVER_IP}:8090/`; // Contract events http endpoint

const privateKey = 'D95611A9AF2A2A45359106222ED1AFED48853D9A44DEFF8DC7913F5CBA727366';

const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer,
    privateKey
);


async function getBalance() {

    const senderAddress = 'TJCnKsPa7y5okkXvQAidZBzqx3QyQ6sxMW';
    const recipientAddress = 'TGehVcNhud84JDCGrNHKVz9jEAVKUpbuiv';

    // The majority of the function calls are asynchronus,
    // meaning that they cannot return the result instantly.
    // These methods therefore return a promise, which you can await.
    const balance = await tronWeb.trx.getBalance(senderAddress);
    console.log({balance});

    // You can also bind a `then` and `catch` method.
    tronWeb.trx.getBalance(senderAddress).then(balance => {
        console.log({balance});
    }).catch(err => console.error(err));

    // If you'd like to use a similar API to Web3, provide a callback function.
    tronWeb.trx.getBalance(senderAddress, (err, balance) => {
        if (err)
            return console.error(err);

        console.log({balance});
    });

    const sendTransaction = await tronWeb.transactionBuilder.sendTrx(recipientAddress, 10);
    console.group('Unsigned send TRX transaction');
        console.log('- Recipient: ' + recipientAddress);
        console.log('- Transaction:\n' + JSON.stringify(sendTransaction, null, 2), '\n');
    console.groupEnd();

    const signedTransaction = await tronWeb.trx.sign(sendTransaction);
    console.group('Signed update token transaction');
        console.log('- Transaction:\n' + JSON.stringify(signedTransaction, null, 2), '\n');
    console.groupEnd();

    await tronWeb.trx.sendRawTransaction(signedTransaction, (err, result) => {
        if(err)
            return console.error(err);
        
        console.group('Broadcast update token transaction');
            console.log('- Result:\n' + JSON.stringify(result, null, 2), '\n');
            tronWeb.trx.getTransactionInfo(signedTransaction.txID, (err, result) => {
                console.log('dd' + JSON.stringify(result, null, 2));
            });
        console.groupEnd();
    });
    /*
    const cfx = await tronWeb.trx.getTransactionsFromAddress(senderAddress);
    console.log({cfx})
    */

    /*
    await tronWeb.trx.sendTransaction(recipientAddress, 10, (err, result) => {
        if(err)
            return console.error(err);

        console.group('Send TRX transaction');
            console.log('- Result:\n' + JSON.stringify(result, null, 2), '\n');
        console.groupEnd();
    });
    */

    /*
    const trxCount = tronWeb.trx.getBlockTransactionCount();
    console.log({trxCount});*/

    const newBalance = await tronWeb.trx.getUnconfirmedBalance(senderAddress);
    console.log('Old balance: ' + balance);
    console.log('New balance: ' + newBalance);
    /*
    const bl = await tronWeb.trx.getCurrentBlock();
    console.log({bl});
    console.log(bl.transactions[2].raw_data.contract[0].parameter);
    */

    const blRange = await tronWeb.trx.getBlockRange(0);
    //console.log(blRange);
    console.log(blRange.length)
    console.log(blRange[28]);

    /*
    const trxCount = await tronWeb.trx.getBlockTransactionCount(
        '000000000000000fbc007e9647e3c2b15a76f9a3d5fa976663b62b66c60727ba');
    console.log({trxCount});
    */

    // Get balance for recipiend address
    const balance2 = await tronWeb.trx.getUnconfirmedBalance(recipientAddress);
    console.log({balance2});

}

getBalance();

