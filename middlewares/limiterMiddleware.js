import express from 'express'
import rateLimit from 'express-rate-limit'


const app = express();


const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 10, // limite chaque IP à 10 requêtes par fenêtre
	message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
	standardHeaders: true, // Retourne les headers RateLimit standard
	legacyHeaders: false, // Désactive les headers obsolètes
});

export default limiter;