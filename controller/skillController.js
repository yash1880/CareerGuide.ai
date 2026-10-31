import Skill from '../models/Skill.js';

export const addSkill = async (req, res) => {
    try {
        const newSkill = new Skill(req.body);
        await newSkill.save();
        res.status(201).json({ message: 'Skill added successfully', skill: newSkill });
    } catch (error) {
        res.status(500).json({ message: 'Error adding skill', error: error.message });
    }
};