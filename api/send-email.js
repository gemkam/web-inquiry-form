export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { fullName, emailAddress, mobileNumber, location, websiteType, budget, description } = req.body;

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'K.A. Agency Inquiry <onboarding@resend.dev>',
                to: ['gemkam@gmail.com', 'abdullahbaluchi219@gmail.com'],
                subject: `New Project Inquiry from ${fullName}`,
                html: `
                    <h2>New Website Project Inquiry</h2>
                    <p><strong>Full Name:</strong> ${fullName}</p>
                    <p><strong>Email Address:</strong> ${emailAddress}</p>
                    <p><strong>Mobile Number:</strong> ${mobileNumber}</p>
                    <p><strong>Location:</strong> ${location}</p>
                    <p><strong>Website Type:</strong> ${websiteType}</p>
                    <p><strong>Budget Range:</strong> ${budget}</p>
                    <p><strong>Requirements:</strong> ${description}</p>
                `
            })
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json({ success: true, data });
        } else {
            return res.status(400).json({ error: data });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
