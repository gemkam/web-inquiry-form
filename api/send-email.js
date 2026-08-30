export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { fullName, emailAddress, mobileNumber, location, websiteType, budget, description } = req.body;

    const recipients = ['gemkam@gmail.com', 'abdullahbaluchi219@gmail.com'];

    const html = `
        <h2>New Website Project Inquiry</h2>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Email Address:</strong> ${emailAddress}</p>
        <p><strong>Mobile Number:</strong> ${mobileNumber}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Website Type:</strong> ${websiteType}</p>
        <p><strong>Budget Range:</strong> ${budget}</p>
        <p><strong>Requirements:</strong> ${description}</p>
    `;

    // IMPORTANT: onboarding@resend.dev is Resend's sandbox "from" address.
    // It can only deliver to the single email address that owns your Resend
    // account. If you send one request with BOTH recipients in the same
    // "to" array, Resend rejects the whole request the moment one recipient
    // isn't that account address, so neither person gets the email.
    // Sending one request PER recipient means the one that matches your
    // Resend account still gets delivered, and only the mismatched one fails.
    // To reliably deliver to BOTH addresses, verify your own domain at
    // resend.com/domains and change "from" below to something like
    // 'K.A. Agency Inquiry <inquiries@yourdomain.com>'.
    const results = await Promise.all(recipients.map(async (to) => {
        try {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: 'K.A. Agency Inquiry <onboarding@resend.dev>',
                    to: [to],
                    subject: `New Project Inquiry from ${fullName}`,
                    html
                })
            });
            const data = await response.json();
            return { to, ok: response.ok, data };
        } catch (error) {
            return { to, ok: false, error: error.message };
        }
    }));

    const anySucceeded = results.some(r => r.ok);
    const allSucceeded = results.every(r => r.ok);

    return res.status(anySucceeded ? 200 : 500).json({
        success: anySucceeded,
        allSucceeded,
        results
    });
}
