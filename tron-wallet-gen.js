import * as accounts from './utils/accounts'
import * as HDKey from 'hdkey'

const bip39 = require("bip39");
const readline = require("readline")

// Sample mnemonics to Use (input at prompt):
// kit youth enroll gravity inform coil life response over collect shrimp fashion desk million differ style october hill first fiscal reform among fiscal word
// First generated address should be: TVSpgfe4aHESGaSG6aQzpML2cH9fG2ZEac

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
})

const CoinCode = 195; // Reference: https://github.com/satoshilabs/slips/blob/master/slip-0044.md

console.log("Enter mnemonics (empty for random): ")
rl.on('line', function(words) {
    var mnemonic = undefined;
    if (words.trim().length == 0) {
        // Create random words.
        // Use strength of 256 bits = 24 words.
        mnemonic = bip39.generateMnemonic(256);
        console.log("Generated mnemonics: " + mnemonic);
    } else {
        // Verify that the mnemonics are valid.
        if (bip39.validateMnemonic(words)) {
            mnemonic = words;
        } else {
            throw Error("Invalid mnemonics");
        }
    }

    const seed = bip39.mnemonicToSeed(mnemonic);
    const masterHdkey = HDKey.fromMasterSeed(seed);
    for (var i = 0; i < 10; i++) {
        const path = `m/44'/${CoinCode}'/0'/0/${i}`;
        const hdKey = masterHdkey.derive(path)

        const accountData = accounts.generateAccountFromPriKeyBytes(hdKey.privateKey);

        console.log(`Address (base 58):    ${accountData.address.base58}`);
        console.log(`Address Private Key:  ${accountData.privateKey}`);
        console.log(`Address PUB Key:      ${accountData.publicKey}`);
        console.log();
    }

    console.log("\nEnter mnemonics (empty for random): ");
});
