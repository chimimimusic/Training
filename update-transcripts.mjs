import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { modules } from './drizzle/schema.js';
import { eq } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const transcriptContent = {
  1: `Module 1A: Introduction to SoundBridge Health Protocol

Welcome to the SoundBridge Health Facilitator Training Program. This comprehensive training will prepare you to deliver our evidence-based music intervention protocol to patients experiencing anxiety, depression, and stress-related conditions.

The SoundBridge Health protocol is built on decades of research demonstrating the therapeutic effects of music on mental health. Our approach combines carefully selected musical elements with structured listening sessions to create measurable improvements in patient outcomes.

As a certified facilitator, you will guide patients through a 10-session protocol designed to reduce symptoms, build coping skills, and promote long-term wellness. Each session follows a specific structure that has been validated through clinical trials and real-world implementation.

Your role as a facilitator is to create a safe, supportive environment where patients can engage with the music therapy process. You will learn to assess patient needs, customize interventions within our framework, and track progress using standardized measurement tools.

Throughout this training, you will master the theoretical foundations of music therapy, understand the neurological mechanisms behind music's therapeutic effects, and develop practical skills for session delivery. You will also learn to navigate common challenges, adapt to different patient populations, and maintain professional boundaries.

The SoundBridge Health protocol is designed to be accessible to facilitators from diverse backgrounds. While musical training is helpful, it is not required. What matters most is your commitment to patient care, your ability to follow structured protocols, and your willingness to engage in ongoing professional development.

By completing this certification program, you will join a network of trained professionals delivering evidence-based music interventions across healthcare settings. You will have access to ongoing support, continuing education opportunities, and a community of practice dedicated to advancing music therapy in mental health care.`,

  2: `Module 1B: Understanding Music Therapy Foundations

Music therapy is a clinical and evidence-based practice that uses music interventions to accomplish individualized goals within a therapeutic relationship. The SoundBridge Health protocol specifically targets anxiety, depression, and stress through structured musical experiences.

Research has consistently demonstrated that music activates multiple brain regions simultaneously, including areas responsible for emotion regulation, memory, and reward processing. When we listen to music, our brains release neurotransmitters like dopamine and serotonin, which play crucial roles in mood regulation.

The therapeutic mechanisms of music work through several pathways. First, music can directly influence physiological responses such as heart rate, blood pressure, and cortisol levels. Slow, rhythmic music tends to promote relaxation by entraining bodily rhythms to calmer patterns.

Second, music engages cognitive processes that can interrupt rumination and negative thought patterns. When patients focus on musical elements, they create mental space away from anxious or depressive thinking. This cognitive shift can provide immediate relief and, over time, help establish new neural pathways.

Third, music carries emotional content that can facilitate emotional expression and processing. Patients often find it easier to access and work through difficult emotions when music provides a non-verbal medium for expression.

The SoundBridge Health protocol leverages these mechanisms through carefully designed session structures. Each session includes specific musical selections chosen for their therapeutic properties, combined with guided reflection and skill-building exercises.

Our approach is informed by multiple theoretical frameworks, including neurologic music therapy, psychodynamic music therapy, and cognitive-behavioral approaches. We integrate these perspectives into a cohesive protocol that is both evidence-based and practically applicable.

As a facilitator, you will learn to recognize how different musical elements—tempo, harmony, melody, rhythm—affect patient responses. You will develop skills in selecting appropriate music, timing interventions, and adapting to individual patient needs while maintaining protocol fidelity.`,

  3: `Module 2: Patient Assessment and Intake

Effective music therapy begins with thorough patient assessment. The intake process establishes baseline measurements, identifies treatment goals, and builds the therapeutic relationship that will support the intervention.

During the initial assessment, you will gather information about the patient's mental health history, current symptoms, musical preferences, and treatment expectations. This information guides your approach and helps you customize the protocol within its structured framework.

The SoundBridge Health intake includes standardized assessment tools that measure anxiety, depression, and stress levels. These tools provide quantitative data that you will use to track progress throughout the 10-session protocol. Baseline scores also help determine whether the protocol is appropriate for the patient's needs.

Musical history is a critical component of assessment. You will explore the patient's relationship with music, including genres they enjoy, emotional associations with specific songs or styles, and any previous experiences with music therapy or music-based wellness practices.

It's important to identify any contraindications or special considerations. While music therapy is generally safe, some patients may have trauma associations with certain types of music, hearing sensitivities, or cultural considerations that affect their engagement with the protocol.

The intake session also serves to educate patients about what to expect. You will explain the protocol structure, clarify the facilitator's role, and address any questions or concerns. Setting clear expectations helps patients engage more fully in the therapeutic process.

Building rapport during intake is essential. Patients need to feel safe, understood, and confident in your ability to guide them through the protocol. Your demeanor, communication style, and genuine interest in their wellbeing lay the foundation for effective treatment.

Documentation is a key responsibility during intake. You will record assessment data, treatment goals, and any relevant clinical information in a secure, HIPAA-compliant manner. This documentation supports continuity of care and provides data for outcome evaluation.`,

  4: `Module 3: Session Structure and Delivery

Each SoundBridge Health session follows a consistent structure designed to maximize therapeutic benefit while providing flexibility for individual patient needs. Understanding this structure is essential for effective facilitation.

Sessions typically last 45-60 minutes and include five key components: opening check-in, musical engagement, guided reflection, skill practice, and closing. This structure creates a predictable rhythm that helps patients feel secure while allowing space for therapeutic work.

The opening check-in (5-10 minutes) establishes the session's focus. You will ask patients about their current state, any changes since the last session, and what they hope to address today. This conversation informs your approach and helps patients transition into the therapeutic space.

Musical engagement (20-30 minutes) is the core of each session. Patients listen to carefully selected musical pieces while you guide their attention to specific elements. You may ask them to notice how the music affects their breathing, what emotions arise, or what memories or associations emerge.

The music selections progress systematically across the 10-session protocol. Early sessions use calming, predictable music to establish safety and teach relaxation responses. Middle sessions introduce more varied musical elements to build emotional regulation skills. Later sessions focus on integration and maintenance.

Guided reflection (10-15 minutes) helps patients process their experience and connect musical engagement to their daily lives. You will use open-ended questions to explore insights, identify patterns, and reinforce therapeutic gains. This reflection deepens the therapeutic impact beyond the immediate musical experience.

Skill practice (5-10 minutes) teaches patients techniques they can use independently. These might include breathing exercises paired with music, methods for using music to manage anxiety, or strategies for building positive emotional experiences through musical engagement.

The closing (5 minutes) provides transition back to daily life. You will summarize key points, assign any between-session practices, and ensure the patient feels grounded before leaving. A strong closing reinforces the session's benefits and supports continuity between sessions.`,

  5: `Module 4: Music Selection and Therapeutic Elements

Selecting appropriate music is both an art and a science. The SoundBridge Health protocol provides specific playlists for each session, but understanding the principles behind these selections enhances your effectiveness as a facilitator.

Tempo is one of the most important therapeutic elements. Slower tempos (60-80 beats per minute) generally promote relaxation and align with resting heart rates. Faster tempos can energize or activate, which may be therapeutic in specific contexts but requires careful application with anxious patients.

Harmonic complexity affects emotional response. Simple, consonant harmonies tend to feel safe and predictable, making them ideal for early sessions. More complex harmonies can evoke richer emotional responses and are introduced gradually as patients develop regulation skills.

Melodic contour—the shape of the melody—influences emotional trajectory. Ascending melodies often feel hopeful or energizing, while descending melodies may feel calming or melancholic. Understanding these patterns helps you anticipate and guide patient responses.

Rhythm provides structure and can influence physiological responses. Steady, predictable rhythms promote feelings of safety and can help regulate breathing and heart rate. Syncopated or irregular rhythms create interest but may be activating for some patients.

Instrumentation matters significantly. String instruments often evoke emotional depth, piano can feel intimate or contemplative, and nature sounds or ambient textures provide non-intrusive background for relaxation. Cultural associations with instruments should also be considered.

Lyrics require careful consideration. While instrumental music is often preferred in therapeutic contexts, carefully selected songs with lyrics can facilitate emotional expression and provide language for experiences patients struggle to articulate. However, lyrics can also be distracting or triggering.

The SoundBridge Health protocol uses a progression from simple to complex, predictable to varied, and passive to active engagement. This progression mirrors patients' developing capacity for emotional regulation and ensures therapeutic experiences remain within their window of tolerance.`,

  6: `Module 5: Facilitating Emotional Processing

Music naturally evokes emotional responses, and skilled facilitation helps patients process these emotions therapeutically. Your role is to create safety, guide exploration, and support integration of emotional experiences.

Emotional responses to music vary widely. Some patients may feel immediate relief or joy, while others may encounter difficult emotions like grief or anger. All responses are valid and potentially therapeutic when properly facilitated.

Creating emotional safety is your primary responsibility. Patients need to know that whatever they feel is acceptable and that you can hold space for their experience without judgment. Your calm presence and genuine acceptance provide the container for emotional work.

When strong emotions arise, resist the urge to fix or minimize them. Instead, validate the patient's experience and help them stay present with the emotion. Simple statements like "I see this is bringing up something important" or "Take your time with this feeling" provide support without directing.

Grounding techniques are essential when emotions become overwhelming. You might guide patients to notice their breath, feel their feet on the floor, or focus on specific musical elements. These techniques help patients stay within their window of tolerance while processing difficult material.

Reflection questions help patients make meaning of emotional experiences. Ask what the emotion might be communicating, where they feel it in their body, or what memories or situations it connects to. These questions deepen therapeutic work without pushing too hard.

Some patients intellectualize or avoid emotional engagement. Gentle invitations to notice physical sensations or pause in silence can help them drop into felt experience. However, respect their pace and don't force emotional expression.

Cultural considerations affect emotional expression and processing. Some cultures encourage open emotional display, while others value restraint. Adapt your facilitation style to honor patients' cultural contexts while still supporting therapeutic work.`,

  7: `Module 6: Managing Challenging Situations

Even with careful planning, challenging situations arise in therapeutic work. Developing skills to navigate these moments is essential for effective facilitation and patient safety.

Patient resistance may manifest as skepticism about the protocol, reluctance to engage, or intellectualization. Rather than confronting resistance directly, explore its origins with curiosity. Often, resistance protects against vulnerability or past disappointment with treatment.

Some patients experience heightened anxiety during sessions, particularly when music evokes unexpected emotions. Have a plan for managing acute anxiety, including grounding techniques, breathing exercises, and the option to pause or change the music. Your calm presence is the most powerful intervention.

Trauma responses can emerge when music triggers traumatic memories. If a patient becomes dysregulated, stop the music immediately, help them ground in the present, and assess whether they need additional support. Always have referral resources for crisis situations.

Patients may become overly dependent on sessions or on you as the facilitator. While therapeutic relationships are important, maintain appropriate boundaries. Emphasize the patient's own capacity for healing and teach skills for independent use of music between sessions.

Technical difficulties—equipment failures, interruptions, or environmental disruptions—can disrupt the therapeutic flow. Have backup plans and practice flexibility. Sometimes, how you handle disruptions models important skills for patients about managing unexpected challenges.

Cultural or musical mismatches may occur despite careful assessment. If a patient doesn't connect with the protocol's musical selections, explore alternatives within the therapeutic framework. The relationship and the process matter more than any specific piece of music.

Ethical dilemmas require careful navigation. If you encounter situations beyond your scope of practice, recognize your limits and make appropriate referrals. Document concerns and consult with supervisors when needed.`,

  8: `Module 7: Measuring Outcomes and Progress

Systematic outcome measurement demonstrates the protocol's effectiveness, guides treatment decisions, and provides accountability to patients and stakeholders. The SoundBridge Health protocol includes specific tools and processes for tracking progress.

Standardized assessment tools are administered at intake, mid-protocol (after session 5), and completion (after session 10). These tools measure anxiety, depression, and stress levels using validated instruments that allow comparison to clinical norms.

Session-by-session tracking captures immediate responses and patterns over time. After each session, patients complete brief ratings of their current mood, anxiety level, and the session's helpfulness. This data helps you identify what's working and adjust as needed.

Qualitative feedback provides rich information beyond numerical scores. Regular check-ins about patients' experiences, insights, and changes in daily life reveal therapeutic impacts that standardized measures might miss. Document these observations carefully.

Progress isn't always linear. Patients may experience setbacks, plateaus, or sudden breakthroughs. Help patients understand that fluctuation is normal and that overall trends matter more than day-to-day variations.

When progress stalls, review the treatment plan collaboratively. Perhaps goals need adjustment, or external stressors are interfering. Sometimes, simply acknowledging the plateau and renewing commitment to the process is enough to restart movement.

Data should inform but not dictate treatment. If quantitative measures show improvement but the patient reports feeling worse, trust the patient's lived experience. Conversely, if scores remain stable but the patient reports meaningful changes, explore what the numbers might be missing.

Sharing progress data with patients can be motivating and empowering. Visual representations of improvement over time help patients recognize changes they might otherwise overlook. This feedback reinforces their investment in the therapeutic process.`,

  9: `Module 8: Cultural Competence and Adaptation

Music is deeply embedded in cultural contexts, and effective facilitation requires cultural humility and adaptability. The SoundBridge Health protocol provides a framework that can be culturally adapted while maintaining therapeutic integrity.

Cultural competence begins with self-awareness. Examine your own cultural background, musical preferences, and assumptions about what constitutes "therapeutic" music. Recognize that your perspective is one among many valid approaches to music and healing.

Different cultures have distinct musical traditions, emotional expression norms, and beliefs about mental health and healing. What feels calming or therapeutic in one cultural context might feel foreign or uncomfortable in another. Always prioritize the patient's cultural experience over your assumptions.

Language considerations extend beyond verbal communication. Musical language—the scales, rhythms, and structures that feel familiar or foreign—varies across cultures. When possible, incorporate music from patients' cultural backgrounds while maintaining the protocol's therapeutic principles.

Some cultures have strong traditions of communal music-making, while others emphasize individual listening. Some value improvisation and spontaneity, while others prefer structured, composed music. Adapt your facilitation style to align with patients' cultural comfort zones.

Spiritual and religious dimensions of music may be important for some patients. Be respectful of these connections while maintaining appropriate boundaries in a clinical setting. If patients want to incorporate sacred music, discuss how this fits within the therapeutic framework.

Power dynamics and historical trauma affect therapeutic relationships across cultural differences. If you are from a dominant culture working with marginalized populations, acknowledge this reality and work actively to create safety and trust. Cultural humility means recognizing what you don't know and being willing to learn.

Adaptation doesn't mean abandoning the protocol's evidence base. Core therapeutic principles—creating safety, using music to regulate emotions, building skills—transcend cultural boundaries. The specific musical content and facilitation style can flex while maintaining these foundations.`,

  10: `Module 9: Professional Development and Self-Care

Sustaining a career as a music therapy facilitator requires ongoing professional development and intentional self-care. This module addresses the practical and personal dimensions of maintaining your practice over time.

Continuing education keeps your skills current and your practice evidence-based. Stay informed about new research in music therapy, neuroscience, and mental health treatment. Attend workshops, conferences, and training opportunities that deepen your expertise.

Peer consultation and supervision provide essential support and quality assurance. Regular discussions with other facilitators help you process challenging cases, gain new perspectives, and avoid professional isolation. Seek out formal supervision, especially early in your practice.

Documentation and administrative tasks are necessary but can feel burdensome. Develop efficient systems for record-keeping, billing, and communication that meet professional standards without overwhelming you. Good systems protect both you and your patients.

Vicarious trauma and compassion fatigue are real risks in therapeutic work. Regularly assess your emotional state and recognize warning signs like emotional numbness, cynicism, or difficulty separating from patient concerns. These signs indicate a need for additional support or time off.

Self-care isn't optional—it's a professional responsibility. You cannot facilitate healing for others if you're depleted. Develop sustainable practices that nourish you physically, emotionally, and spiritually. This might include your own music engagement, exercise, therapy, or spiritual practice.

Work-life boundaries protect both you and your patients. Establish clear policies about availability, communication, and session scheduling. Honor these boundaries consistently, recognizing that doing so models healthy limits for patients.

Building a sustainable practice includes financial planning, marketing, and business development. Whether you work independently or within an organization, understand the business aspects of your work. Financial stability reduces stress and allows you to focus on patient care.

Your relationship with music may change as you use it professionally. Some facilitators find they need to separate their personal music enjoyment from their therapeutic work. Others find their appreciation deepens. Pay attention to your own musical needs and nurture your love of music.`,

  10: `Module 10: Integration and Next Steps

Congratulations on reaching the final module of your SoundBridge Health facilitator training. This module focuses on integrating everything you've learned and preparing for your certification and practice launch.

Review the core competencies you've developed: understanding music therapy foundations, conducting thorough assessments, structuring effective sessions, selecting therapeutic music, facilitating emotional processing, managing challenges, measuring outcomes, practicing cultural competence, and maintaining professional standards.

The certification process includes completing all training modules, passing assessments, and demonstrating competency through supervised practice sessions. You will conduct at least three supervised sessions with feedback from a certified trainer before receiving full certification.

Once certified, you'll have access to the SoundBridge Health facilitator network. This community provides ongoing support, consultation, and professional development opportunities. Monthly calls, online forums, and regional gatherings help you stay connected and continue learning.

Marketing your services requires clear communication about what you offer and who you serve. Develop a simple explanation of the SoundBridge Health protocol and its benefits. Build relationships with referral sources like therapists, physicians, and community organizations.

Insurance and liability considerations vary by location and practice setting. Understand your professional liability insurance needs, documentation requirements, and scope of practice limitations. When in doubt, consult with professional organizations or legal advisors.

Starting small and building gradually is a wise approach. Begin with a few patients, refine your skills, and expand as you gain confidence and experience. Quality matters more than quantity, especially in the early stages of your practice.

Feedback and continuous improvement should be ongoing. Regularly seek feedback from patients, peers, and supervisors. Reflect on what's working and what needs adjustment. The best facilitators remain humble learners throughout their careers.

Your impact as a facilitator extends beyond individual patients. By delivering evidence-based music interventions, you contribute to the growing body of knowledge about music therapy's effectiveness. You also help reduce stigma around mental health treatment and expand access to innovative therapeutic approaches.

Remember why you began this training. Whether you were drawn to music's healing power, wanted to serve people struggling with mental health challenges, or sought to combine your passions for music and helping others, that initial motivation will sustain you through challenges and celebrate successes.

Welcome to the SoundBridge Health facilitator community. We're honored to have you join us in this meaningful work.`
};

console.log('Updating module transcripts...');

for (const [moduleId, content] of Object.entries(transcriptContent)) {
  await db.update(modules)
    .set({ transcriptContent: content })
    .where(eq(modules.id, parseInt(moduleId)));
  console.log(`Updated transcript for Module ${moduleId}`);
}

console.log('All transcripts updated successfully!');
await connection.end();
