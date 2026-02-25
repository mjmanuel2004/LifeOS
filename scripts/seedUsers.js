import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

const seedUsers = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lifeos';

        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB Connected...');

        // Vérification si l'administrateur existe déjà
        const adminEmail = 'admin@lifeos.com';
        const userEmail = 'user@lifeos.com';

        let admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            admin = await User.create({
                name: 'Admin',
                email: adminEmail,
                password: 'password123',
                role: 'admin'
            });
            console.log('✅ Admin user created: admin@lifeos.com / password123');
        } else {
            console.log('ℹ️ Admin user already exists.');
        }

        // Vérification si l'utilisateur normal existe déjà
        let regularUser = await User.findOne({ email: userEmail });
        if (!regularUser) {
            regularUser = await User.create({
                name: 'Utilisateur',
                email: userEmail,
                password: 'password123',
                role: 'user'
            });
            console.log('✅ Regular user created: user@lifeos.com / password123');
        } else {
            console.log('ℹ️ Regular user already exists.');
        }

        console.log('🎉 Seeding complete!');
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();
