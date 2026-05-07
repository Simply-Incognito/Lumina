const bcrypt = require('bcryptjs');

async function test() {
    try {
        const hash = await bcrypt.hash('password123', 10);
        console.log('Hash:', hash);
    } catch (err) {
        console.error('Error:', err);
    }
}

test();
