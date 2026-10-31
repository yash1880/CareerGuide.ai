export const getAssessmentPage = (req, res) => {
    res.render('career-assessment');
};

export const submitAssessment = async (req, res) => {
    try {
        const { answers } = req.body;
        // Simple logic to evaluate assessment
        const recommendedCareer = "Full Stack Developer";

        res.status(200).json({
            success: true,
            recommendedCareer,
            message: "Assessment evaluated successfully!"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};