import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

const transcripts = [
  {
    moduleNumber: 1,
    title: "Session 1: Introduction",
    transcript: `Facilitator Certification Course - Training Session One

*Presenter: Zola*

# Introduction

Welcome to the Sound Bridge Protocol Facilitator Certification Course.
I'm Zola, and I'll be your guide as we explore this innovative approach to emotional regulation and stress management. In this session, I'll guide you as you learn how to facilitate your patient's first encounter with the Sound Bridge Telehealth Protocol. Our goal is to provide patients with coping skills that will transform their relationship with stress, anxiety, and emotional regulation.

# Building Trust

The foundation you build in this first session determines the success of the entire ten-week journey. This is the moment when patients will decide whether to trust you through their screen, trust the process, and trust their own capacity to experience something new that may make them feel vulnerable while being physically distant from you.

# About the Sound Bridge Protocol

The Sound Bridge Protocol is a structured ten-session intervention that leverages music's unique capacity to influence our emotional states, physiological responses, and cognitive processes. Developed through research in neuroscience, psychology, and music therapy, this protocol combines three powerful elements:

**1. Strategic music listening** with specific tempos and rhythms

**2. Precise pre-shot routines** that prepare the mind and body

**3. Targeted breathing techniques** that activate the parasympathetic nervous system

When these elements are combined, they create a powerful tool for helping individuals regulate emotions and manage their stress effectively. The protocol is grounded in several scientific principles.

# Technology Component

A key technological component of the protocol is our proprietary Music Search App, available exclusively on our platform. This app allows practitioners to filter streaming music to identify selections that meet specific criteria supporting emotional regulation. It takes the guesswork out of music selection by providing informed options while still honoring personal preference and response.

# The Three-Step Process

At the heart of the Sound Bridge Protocol is a three-step process that patients follow and implement:

**First: Music Listening**

Patients select and listen to music they already know with specific tempos, rhythms, and emotional associations that support their regulatory goals. The music serves as both an emotional anchor and a physiological guide.

**Second: The Pre-Shot Routine**

Patients develop a personalized sequence of physical and mental actions that prepare them to regulate their nervous system. As a facilitator, you will help them create a routine that incorporates their unique experiences and memories.

**Third: Breathwork**

Patients learn how to adopt specific breathing techniques that activate the parasympathetic nervous system—our body's rest and digest response—which counteracts the fight-or-flight stress response. Together, these three elements create powerful synergy that participants can access whenever they need to regulate emotions or manage stress.

# Course Overview

Throughout the certification course, you will learn how to guide patients through all ten sessions of the Sound Bridge Protocol. Each module will cover:

• Session objectives and preparation
• Detailed facilitation instructions
• Common challenges and adaptations
• Progress monitoring components

# Facilitator Competencies

You will develop the following key facilitator competencies:

• Protocol knowledge and music analysis
• Clear and empathetic communication
• Group facilitation skills
• Flexibility in adapting to patient needs
• Assessment of patient progress
• Self-reflection on your facilitation effectiveness

# Conclusion

By the end of this course, you'll be equipped to implement the Sound Bridge Protocol in various settings, helping individuals develop personalized tools for emotional regulation. In our next video, we will explore pre-program preparation and intake assessment.

*Thank you for joining us on this journey of combining music, movement, and breath for emotional well-being.*`
  },
  {
    moduleNumber: 2,
    title: "Session 1B: Facilitation Skills",
    transcript: `Sound Bridge Facilitator Training

**Session 1B: Facilitation Skills**

*Video Transcript*

*Duration: 7:58 | Presenter: Zola*

Now that you understand what the Sound Bridge Protocol is, let's focus on how to facilitate Session 1 effectively in a telehealth environment.

Session 1 is the most critical session of the entire ten-week journey. This is the moment when your patients decide three things: whether to trust you through their screen, whether to trust the process, and whether to trust themselves to try something new that may make them feel vulnerable—all while being physically distant from you. The foundation you build in this first session determines the success of everything that follows. So let's make sure you're fully prepared.

One of your first tasks is helping patients create an effective space for virtual sessions. Guide them toward a comfortable space with these three essential elements: quality audio, good lighting, and privacy. Don't require them to purchase specific equipment—work with what they have. Don't insist that sessions take place in the same room, and definitely don't suggest public spaces. Your patients need to feel safe to be vulnerable, and that requires privacy in their own environment.

During Session 1, participants often share deeply personal information. When someone says something like "I just want to stop feeling so anxious all the time," how you respond matters enormously. Your instinct might be to immediately offer solutions or reassurance. Remember to resist that urge. Instead, validate their courage first.

An appropriate response would be: "Thank you for sharing that with me. It takes courage to name what we're struggling with, especially in a virtual format." This response does three things: it honors their vulnerability, it acknowledges the unique challenge of opening up through a screen, and it builds the trust foundation that Session 1 is all about.

What you should NOT do is immediately jump to fixing the problem, change the subject to avoid discomfort, ask them to save personal sharing for later sessions, or redirect them to a medical professional unless there's a genuine clinical concern.

When you explain the protocol to patients, tone matters as much as your content. Be logical and evidence-based, not mystical or overly complex. This protocol is grounded in neuroscience, psychology, and music therapy research—present it that way. Your patients don't need dramatic urgency or mystical intrigue. They need to understand why this approach works. Build trust in the process.

The pre-shot routine is something you co-create with each patient. It's not a script you hand them—it's personalized to their unique experiences. The routine includes five elements:

1. Physical centering — a position that grounds their body
2. Attention focusing — directing their mental attention
3. Breathing preparation — initial breath awareness
4. Intention setting — clarifying their purpose for this practice
5. Transition cue — the signal that moves them into the music listening phase

The pre-shot routine is a variation of Neuro-Linguistic Programming. This concept is similar to how memory is triggered by music. Here's how it works: you can train your brain to recall a specific feeling or memory by repeating a ritualistic movement. With repetition, you can recall a specific emotional state on demand simply by repeating the routine.

In the protocol, you'll teach your patients how to use the pre-shot routine concept to prepare them to get the maximum benefit when practicing the breathing and listening exercises. Whatever movement they create as their pre-shot routine should feel natural to them—not imposed by you.

When helping patients select their first songs, there's one thing you must absolutely avoid: judging their choices or imposing your preferences. Your role is to consider their audio setup quality, balance their personal preferences with regulation principles, explore how different genres may support their emotional goals, and discuss how they'll access music for daily practice.

The music they choose is theirs—even if you wouldn't choose that song, even if it's not what other patients typically select. Honor their choice. You need to emphasize that their personal connection to whatever music they choose is a big part of why the process works. Their connection to the music is what makes the protocol powerful for regulation.

During Session 1, you'll guide patients through their first practice of the protocol. How you frame this experience shapes everything that follows. Success in this first practice is NOT about perfect technique. Frame it as exploration and data gathering.

Use language like this: "This first practice is about exploration. Notice what happens to your mind and body when you practice. What feels natural? What feels awkward? What surprises you? Remember, there's no wrong way to do this."

Using this language removes performance pressure and opens space for genuine discovery. Your patients aren't being tested—they're beginning a journey to learn how to find peace and balance whenever they need it.

When you assign daily homework, how you frame it matters more than what you assign. Don't present homework as mandatory requirements with consequences. Don't frame it as a test of their commitment or competition with other participants. And definitely don't make it sound like a medical prescription.

Instead, frame it as exploration and data gathering. Try using this phrase: "This week you're gathering data about your own responses to the protocol in your personal space. Notice what works, what doesn't, and what feels different at different times of day. You're the researcher studying yourself to learn more about yourself."

And here's something critical: when patients miss practice days and are feeling they failed, help reframe their opinion. If you say "Missed days are actually an opportunity for you to learn, not another problem for you to solve," you are really reframing their perception of their behavior.

Continuing on, if you say "Missed days actually provide you with valuable information," you can see this reframing. By framing comments this way, you're telling them: a missed day doesn't mean you're not ready for the program, a missed day doesn't require you to make up work, a missed day doesn't need to be recorded as a concern, and it definitely doesn't mean that you have to start over.

A good way to examine the reasons why they didn't practice would be to ask: "So you didn't practice Tuesday. Tell me, what was happening in your life that day?" By getting them to examine how and why a day of practice was missed tells us a lot. It tells us something about when the protocol fits into their life and when it doesn't.

You'll be providing patients with resources to use between sessions. Present these as extended support and practice companions—not as additional homework that increases their workload. These aren't optional extras only for highly motivated participants. They're not backup plans in case telehealth sessions get cancelled. And they're definitely not assessment tools to measure progress.

Position them like this: "These resources are here to support your practice between our sessions. Think of them as companions on your journey. Use what helps, skip what doesn't."

Let me leave you with the most important thing: your mindset. Session 1 success doesn't come from demonstrating your expertise or impressing patients with your knowledge. It doesn't come from strict adherence to the protocol without flexibility. And it definitely doesn't come from emphasizing the limitations of virtual delivery.

What matters is this: trust the telehealth process, trust your patients' ability to engage meaningfully from their own spaces, and let genuine care guide every virtual interaction. Your steady, caring presence—even through a screen—creates the safety patients need to begin this vulnerable work. That's what Session 1 is really about.

In Session 2, your patients will come back having tried the protocol on their own for the first time. They'll be vulnerable and uncertain. You'll be ready to meet them with the skills we'll cover in the next training video.`
  },
  {
    moduleNumber: 3,
    title: "Session 2: The Body and Stress",
    transcript: `Sound Bridge Facilitator Training

**Session 2: The Body and Stress**

*Video Transcript*

*Duration: 7:32 | Presenter: Zola*

Welcome to Session 2 training. This is where the real work begins. Your patients are feeling vulnerable, uncertain, and are often self-conscious about their first attempts at the protocol. Your response to their struggles in this session determines whether they lean into the work or retreat from it.

Remember: discomfort with new somatic practices is universal. Your job is to normalize their experience while building confidence for deeper engagement.

When patients say "I didn't give it my best effort" or "I felt uncomfortable," resist the urge to offer solutions immediately. First, validate their feelings by saying something like: "Almost everyone feels awkward learning these techniques. That's completely normal."

Try some follow-up techniques without using the word "why." Instead of saying "Why do you feel uncomfortable?" try asking "Can you tell me more about what felt awkward?" or "What part of the process felt most challenging?" Another approach would be "Help me understand what feeling uncomfortable means to you." These types of questions invite exploration without triggering defensiveness.

Notice how we offer examples from other clients, like "Almost everyone feels awkward starting these techniques." This reduces shame and provides social proof that their experiences are shared and not unique.

It is important for the patient to understand what emotional regulation is by using language they can easily understand. When explaining emotion regulation, avoid suggesting that we should always "turn down the volume" of negative emotions. This "volume control" metaphor implies emotions are simply problems to be managed and controlled.

Instead, explain to your patients that sometimes we want to shorten difficult emotions and other times we want to extend pleasant ones. Regulation isn't about feeling better—it's about having choice in our emotional experiences.

Here is the key clarification for you to keep in mind: emotion regulation is not only about positive versus negative emotions—it's about timing, intensity, and duration. Help patients understand they're developing emotional flexibility, not emotional suppression.

By using an example that you both can relate to—using baking chocolate chip cookies as an example is perfect because it's universally relatable and immediately embodied. When patients share their sensory memories, match their enthusiasm: "Oh, I love fresh-baked cookies! They always do it for me too!" This builds rapport and normalizes the power of sensory experiences. Use their examples throughout the session to personalize abstract concepts and show them that their specific sensory memories become teaching tools.

When explaining the autonomic nervous system, be concrete and relatable rather than academic. "Your body protects you without you even thinking about it" is more compelling than technical terminology. These examples—like reflexively pulling your hand from heat or jumping when startled—create immediate recognition. Watch for "aha" moments when patients realize how sophisticated their unconscious responses already are.

When asked, most patients will say "Oh, I haven't thought about stress physiology." This is a great response—it gives us something valuable to work with. Uncertainty creates teaching moments rather than allowing inadvertent gaps in knowledge to lead to misinformed opinions. If you frame complexity as fascinating rather than intimidating, you create a situation that is conducive to learning.

Now here is a language suggestion you can use in your sessions: Offer "fight or flight" reactions as examples of the classic stress response and emphasize that this is your body's adaptive way to fight, flee, or freeze efficiently in response to perceived threats. By framing these responses as a natural part of human evolution, you help your patients understand their stress responses are a normal reaction to the sensory input they receive in any given circumstance—rather than assuming there is something wrong with them.

It is always a good practice when describing physiological changes to speak slowly and invite patients to notice the sensations in their own bodies. If you say "You may feel your heart beating faster right now just thinking about stress," you're helping them connect abstract concepts to immediate experience. Using detailed physical descriptions helps patients develop better body awareness and recognize early stress signals in daily life. This is preparing them to absorb the basic tenets of the Sound Bridge process.

When you tell your patients that music, movement, and breath are powerful tools that work with the nervous system and not against it, you're giving your patients the permission to try new methods. You are presenting the idea that we're not fighting their stress response—we're giving their body better options. This guides your patients from resistance to change and encourages them to use new methods that can be integrated into their daily lives.

Your goal as a facilitator is to help patients see these tools as sophisticated approaches to work with their body's existing wisdom.

Music Search App demonstrations should feel collaborative and not prescriptive. You can set this up by saying "Let's explore what resonates with you" rather than saying "This is what you should choose." Giving them the ability to choose music that is relevant and effective, combined with breathing practices and utilizing their personalized pre-shot routine, increases their personal investment in the process.

When patients find meaningful music, be sure to celebrate their discovery by acknowledging their choice. This will build on your relationship and enable more meaningful interactions.

When patients share vulnerable experiences during the exercise—like "I was with my first girlfriend"—receive these comments with appropriate reverence. When your patient shares such intimate thoughts or feelings, don't analyze or interpret. Simply witness and validate. An appropriate response would be: "What a rich experience. Your mind took you to meaningful connections."

Your response to their memories followed by present moment awareness is actually sophisticated regulation in action. Help them recognize this process as success, not randomness.

The fifteen-minute daily commitment for patients to practice what they have learned should feel doable, not burdensome. If patients seem overwhelmed, gently remind them that the program can be customized to match their personal preferences, making practice more enjoyable. It is important for them to understand that even five to ten minutes daily will be beneficial—that practicing consistently is more important than how long they practice each day.

In your sessions, remind patients about daily protocol practice, video watching for the next session, and paying full attention to body responses and thought patterns during practice.

Next week we'll explore how music affects your brain and body through entrainment. You'll discover how different tempos can literally change your heart rate and breathing patterns.

Remember: Session 2 is where trust is built or broken. Your patients are learning to be vulnerable with their bodies and emotions. Your steady, non-judgmental presence gives them permission to continue this brave exploration. Your role is to help them normalize the awkwardness, celebrate small discoveries, and understand that learning regulation skills is an act of self-compassion.`
  },
  {
    moduleNumber: 4,
    title: "Session 3: Entrainment",
    transcript: `Sound Bridge Facilitator Training

**Session 3: Entrainment**

*Video Transcript*

*Duration: 4:34 | Presenter: Zola*

Welcome to Session 3 training. You're about to witness your patients discover something extraordinary about their own bodies. Entrainment is a natural phenomenon that causes two rhythms to sync. The Sound Bridge intervention utilizes this phenomenon by using music at specific tempos to alter patients' physiology whenever they want and wherever they are.

When your patient experiences rhythmic entrainment for the first time, you'll see genuine amazement as they realize music literally changes their body in real time.

This session requires scientific credibility balanced with accessible wonder. Don't forget: you're teaching concepts that sound almost magical but are actually grounded in solid neuroscience.

If patients mention feeling self-conscious about the pre-shot routine, normalize this completely. If you say "It's completely natural when learning something new," you validate their experience without making it a problem to solve. Your response reinforcing that there is no wrong way when creating and practicing a pre-shot routine is crucial. Your patients need permission to adapt rather than pressure to perform perfectly. This builds confidence for the more complex work ahead.

When explaining rhythmic entrainment, watch patients' faces for comprehension. If you see confusion, use more concrete analogies such as: "It's like you're choosing a rhythm for your brain to follow instead of being scattered." By using common examples instead of technical neuroscience language, you remove their confusion and you will be more easily understood.

If the patient responds with "It's as if the music gives my brain a pattern to follow," their response demonstrates their understanding of the concept of entrainment. Celebrate this insight enthusiastically: "That's exactly right! You just described neural entrainment perfectly!"

If the patient has difficulty understanding the concept of entrainment, take time to ensure they comprehend the concept early. To assist you in helping patients understand the neuroscience Sound Bridge is based on, we've provided a white paper, "Holistic Anxiety and Depression Relief," as a resource for you. It provides an in-depth description of entrainment and the Sound Bridge process as a whole.

Motor entrainment is easier for patients to understand because they have already experienced it. Ask the patient: "Have you ever nodded your head rhythmically or tapped your foot while listening to music?" If they have, validate this experience as being sophisticated brain-body communication, not just an unconscious reflex.

Next, connect this familiar experience to the pre-shot routine and the Sound Bridge process by asking: "Did you know that the same synchronization that makes your foot tap can also help regulate your breathing and heart rate?"

Now we will demonstrate to the patient different tempos. Here is the strategy you can employ: First, use a metronome to demonstrate 60 beats per minute versus 120 beats per minute. Before you use music examples, you can find a digital metronome in the Music Search App as a lesson in the Facilitator Training course.

When you use the Music Search App to identify music that is familiar to the patient, it is preferable to choose instrumental pieces with a clear, steady beat, rather three to five minutes in length. Songs with lyrics can be used, but you should let your patient know that lyrics can potentially be distracting and trigger different emotions and memories.

You've just learned the core elements that make Session 3 so powerful: helping your patients discover their body's natural ability to sync with music, normalizing their learning process, and guiding them through rhythmic and motor entrainment using clear, accessible language.

Remember: you're not just teaching concepts—you're facilitating genuine "aha" moments when people realize they can actually influence their own physiology through music. Your role is to create that safe space where wonder meets science and patients feel both amazed and empowered by what their bodies can do.

The tempo demonstration strategy we covered gives you concrete tools, but your real success comes from reading your patients, celebrating their insights, and helping them connect these discoveries to their daily lives. When someone says "It gives my brain a pattern to follow," that's not just understanding—that's the beginning of real therapeutic change.

Now let's test your readiness to facilitate this transformative session. The assessment that follows will help you gauge how well you've absorbed these facilitation strategies and ensure you are prepared to guide participants through their own rhythmic entrainment journey with confidence and skill.`
  },
  {
    moduleNumber: 5,
    title: "Session 4: Memory & Music",
    transcript: `Session 4 Facilitator Training Script

Welcome to session four training. You are about to witness something magical. When patients connect music to their memories, you'll see their faces change in real time. You're not just teaching about memory associations. You're helping people unlock emotional time travel. This session requires having exquisite listening skills.

Your patients will share vulnerable memories, and your response to their stories directly impacts their willingness to go deeper into this powerful work. Your patients are like everyone else. We all need positive reinforcement. When we try something new, we recommend that you have several statements prepared that you can use when praising your patient's efforts.

The goal is to be supportive without being patronizing. Here are some examples. You're making excellent progress. You're becoming more skilled at this. Your awareness is really developing. We want you to rephrase these examples or use your own so that the language is authentic to you. Instead of simply quoting our examples, be sure to avoid using generic comments like, good job.

You'll make a stronger connection if you are specific about what they're doing. Well, when patients describe their tempo experiences, listen for evidence of growing mastery. If your patient says, the exercise got easier, the more I practiced this shows they are developing a new skill, not just following instructions.

Celebrate this as competence building not compliance. If they share that, they understand that faster music requires more deliberate breathing management, it shows their growing awareness of the innate sophistication of nervous system amplify these insights by acknowledging that they are becoming regulation experts.

When you explain music's effect on multiple brain regions, avoid overwhelming technical detail. The goal is to emphasize the incredible power of the brain, not to get bogged down in detailed anatomy lessons. An effective way to express how the brain processes music would be to say, music activates your emotional brain, your memory brain, and your rhythm brain all at once.

This is why music is so powerful. You will find that this approach is more compelling than spending valuable time reciting neuro anatomical specifics. Watching your patients' faces as you describe music processing will instruct how best to proceed in your session. If there is a light in their eyes or a smile on their face, it means they're connecting with you.

If they have glazed looks, then simplify your approach. Ask questions to identify what they are not understanding or what is preventing them from fully engaging. The memory bump concept often creates moments of profound recognition. When patients say it's almost like time travel, they're describing something most people experience, but rarely name.

Validate this as normal and remarkable. Simultaneously, help them understand they're not being nostalgic or indulgent. They're accessing a neurological phenomenon that can be harnessed for present moment regulation. When explaining dopamine release, frame it as evidence of their brain's capacity for healing and regulation.

Tell them your brain has built in systems for feeling better. Music helps you access them. This is more empowering for the patient than technical neurotransmitter discussions. This neurological shortcut language helps patients understand why certain songs feel so immediately powerful. They're not imagining it.

There's real brain chemistry involved. When patients share meaningful memories, you are receiving gifts, handle them with appropriate reverence. If you say that sounds like a really special memory, you are acknowledging the significance of the memory without overanalyzing.

Some memories may bring up sadness or loss alongside positive feelings. Normalize this by saying meaningful memories often carry multiple emotions that the complexity of your memories can actually make them more powerful for you to use when you are working to regulate your nervous system. When patients practice with memory connected music, watch for nonverbal changes, softening faces, deeper breathing, postural shifts, even tears can indicate powerful access to emotional states.

By noticing these subtle changes and providing gentle acknowledgement, you are validating their experiences. When your patient recalls a specific memory, like I could almost smell the pancakes, this shows they're accessing full sensory memories, not just auditory ones. This multisensory activation is what makes memory based regulation so potent.

A patient's observation about sitting up straighter when listening to a graduation song or relaxing their shoulders when listening to a song they associate with comfort shows sophisticated body and emotion awareness. Help them recognize this as an example of them developing advanced emotional intelligence.

You can articulate this recognition by saying you are now able to notice how different memories create different physical responses. Validating their growing expertise in their own nervous system patterns helps them create a solid base of understanding about emotional regulation. They can build upon this awareness throughout the duration of the protocol.

Now that we have shown how music can be used as a tool in emotional regulation, we can build playlists that are unique to each patient to help them achieve specific outcomes. We can organize these playlists by the emotional goals the patient wants to achieve. Examples are generating a comfort and security playlist.

For this, we would use nurturing memories and focus on safe people and places to create a confidence and motivation playlist, we should focus on using achievement memories and empowering experiences.

If the goal is to brighten a patient's emotional state, we would suggest building a playlist that is designed to elicit joy and elevation of mood. For this, we would identify music that is related to celebratory memories and peak personal experiences. To heighten productivity, a focus slash concentration playlist would be useful.

This would direct us to choosing music that recalls productive memories or flow states for each patient. If the goal is to prompt higher energy or engagement in activities, help your patient find music associated with adventure memories or exciting experiences. And finally. If the patient wants to slow down a calm and peaceful playlist, one that triggers tranquil memories and soothing experiences will be helpful.

When introducing playlist categories, help patients see the strategic thinking behind how their playlist are organized. They're not just collecting random favorite songs, they're building an emotional regulation toolkit with specific applications. The question about memory associations changing over time shows sophisticated thinking about the dynamic nature of emotional responses.

We want you to affirm that each patient has the flexibility to adapt their emotional responses while emphasizing the stability of their core formative memories. Frame the protocol as a way to create new positive associations using what they already know. For example, an appropriate comment would be to say you're not just accessing old memories, you're creating new ones through this practice.

Emphasizing this aspect of the protocol builds hope for continued growth and development. The following are common concerns that may come up in sessions. Your patient may be worried about living in the past. You can counteract that concern by emphasizing present moment regulation benefits. If your patient is concerned about painful memories associated with otherwise positive songs, validate and acknowledge the complexity of the situation.

A response could be to suggest focusing on the net positive impact they will receive. Remember, you're not just teaching about memory and music. You're helping patients discover they carry within themselves a vast library of emotional resources. Every meaningful song is a potential key to wellbeing.

Trust their memories, honor their stories, and help them see the treasure trove of regulation tools they already possess.`
  },
  {
    moduleNumber: 6,
    title: "Session 5: Creating Playlists",
    transcript: `Sound Bridge Facilitator Training

**Session 5: Creating Playlists**

*Video Transcript*

*Duration: 6:00 | Presenter: Zola*

Welcome to Session 5 training. You've reached the creative heart of the program. This is where everything clicks. Your patients have learned about entrainment and memory association separately, and now they're ready to become playlist architects, combining both approaches strategically.

This session requires your most creative facilitation energy. You're moving from teaching concepts to collaborative creation. Your enthusiasm for this process will directly influence their investment in building these powerful tools.

When patients describe their memory-connected music experiences, listen for sophisticated observations. When they say "The songs connected to energetic memories made me sit up straighter," this shows they're tracking both emotional and physical responses. That's advanced body awareness developing. Celebrate these insights using a phrase like "You're becoming an expert on your own nervous system responses." This validates their growing sophistication and builds confidence in their emerging skills.

When your patient identifies their top regulatory needs, you're gathering intelligence for all future sessions. Don't rush this conversation—their priorities determine which playlists you'll create and in what order. If your patient mentions three goals, focus your attention on the most meaningful one or two. This is a strategic choice. Depth over breadth creates more powerful tools.

By focusing on the most meaningful goals that the patient identifies, this allows you to create powerful tools that your patients can use immediately. Trying to accomplish too much in the limited amount of time you have is a superficial approach. You'll have better success by working on one solution at a time instead of rushing through the process to make a lot of playlists at once.

Your patient's observation about memory association hitting faster emotionally while tempo affects physical state is sophisticated nervous system awareness. This insight should be celebrated as a breakthrough moment. Help them understand they've discovered something important about how regulation works. Remember: emotional and physiological pathways can be targeted simultaneously, resulting in stronger positive effects. This sets up the rationale for everything you're about to create together.

When creating the anxiety playlist, the goal is to combine both scientific criteria—tempos between 60 and 80 beats per minute—with music that holds personal significance to the patient, such as a song that triggers the memory of a peaceful vacation. This integration of objective and subjective elements is what makes these playlists uniquely powerful.

Some patients will feel overwhelmed by choices while others will want to include everything. Guide them toward quality over quantity. Make sure they understand that three carefully chosen songs with personal resonance are more powerful than ten random selections.

When they mention specific songs, ask them follow-up questions: "What specifically does that jazz album make you feel?" "Where were you when you first heard that song?" "Who were you with?" Gathering these details helps you understand why certain music is more effective than others.

When participants practice with their newly created playlist, you're witnessing a pivotal moment. They're experiencing tools that they co-created rather than techniques you prescribed. Their ownership changes everything. Listen for language like "That felt more powerful than before." This indicates they're experiencing synergy between multiple elements. Celebrate this as evidence of their growing expertise in self-regulation.

The insight about needing a bridge—starting with matching emotions then gradually shifting—is sophisticated emotional intelligence. Many patients discover they can't jump directly from anxiety to calm but need transitional steps. This discovery about gradual versus immediate state changes will inform all future playlist creation. Help them recognize this as valuable self-knowledge that goes far beyond music.

When patients identify additional playlist needs—such as increasing their energy or unwinding after a stressful day—they are thinking like practitioners rather than patients. They are envisioning how these tools will serve them across different life situations. It is true that the more tools you have, the more flexibility you have. Plant seeds for continued development. Encourage their expansion of skills while guiding them to maintain their focus on completing their current playlist first.

The 15-20 minute playlist guideline—basically four to five songs—balances effectiveness with sustainability. Longer playlists risk becoming burdensome; shorter ones may not create sufficient regulatory impact. Help patients understand this isn't arbitrary—it's based on how long it takes for nervous system changes to take effect and for people to maintain daily practice consistently.

As you frame the week's practice, emphasize that they're not just testing playlists—they're gathering data about their own regulation patterns. This approach reduces performance pressure and increases curiosity and engagement.

When you preview the next session's pre-shot routine work, you reinforce the continuity of the protocol and generate anticipation for continued learning and mastery. Throughout the protocol, they're building a comprehensive personal regulation system, not just learning isolated techniques.

Remember: this session transforms patients from regulation novices to playlist creators. Your role now shifts from teacher to creative partner in their development. Their investment in playlists they've co-created will be exponentially higher than in ones you simply assign them tasks to complete.

Trust their musical instincts, guide their regulation understanding, and celebrate every insight they share about their own patterns and preferences.`
  },
  {
    moduleNumber: 7,
    title: "Session 6: Refining Pre-Shot Routines",
    transcript: `Sound Bridge Facilitator Training

**Session 6: Refining Pre-Shot Routines**

*Video Transcript*

*Duration: 7:24 | Presenter: Zola*

Welcome to Session 6 training. You are about to help patients create something profoundly personal: their own rituals they can use to prepare themselves to get the most out of the Sound Bridge process. Pre-shot routines aren't just sequences of actions—they're bridges between chaos and calm, between anxiety and capability.

Your patients have been using a basic routine with music and breathing techniques, but now they're ready to apply all three elements of the program. This session transforms them from simply following your instructions to creating rituals that will serve them for years.

When patients describe their playlist experiences, listen for language that reveals deeper patterns. As an example, if your patient says "When I listen to my playlist, my brain recognized it as a signal," this shows they're developing state-dependent learning. In other words, state-dependent learning is a phenomenon where information is better retrieved when a person is in the same physiological or psychological state as when they learned it. Celebrate this sophistication because they are becoming regulation experts. The best thing about this: they're learning how to be in control of the process instead of the process being in control of them.

If they complain about feeling rushed through the routine, their comment is priceless. It shows they want to engage more fully, not less. This is investment, not resistance. Frame their increasing awareness by honoring their growing expertise, not fixing something that is broken.

Common challenges your patients may encounter include: feeling self-conscious in public spaces, forgetting steps under stress, routines becoming mechanical rather than meaningful, and time constraints making full routine practice impossible.

When you explain pre-shot routine origins, you're giving your patients permission to take themselves seriously. Athletes use these techniques because their livelihood depends on being prepared to perform at their best. Emphasize that what your patients learn in the protocol can be beneficial in every aspect of their lives. Help them see that their daily challenges deserve the same intentional preparation as the elite athletes they admire.

When offering constructive criticism, be sure to connect to their world using examples that are relevant to them. If they believe that their pre-shot routine is every bit as important as Michael Jordan's pre-free-throw ritual, they can create a moment of control that is as significant as making the game-winning shot. The key for you is to make your comments personally relevant, not academically interesting.

Keep the neurological explanation personal, hopeful, and easy to understand. When you say to your patient "Every time you practice this routine, you're literally carving a pathway in your brain that leads to calm," you will be much more compelling than reciting technical jargon about neuroplasticity.

The patient's recognition that their pre-shot routine has become natural to them—that they execute it without conscious thought—means they are experiencing neuroplasticity in real time. Celebrate this as evidence of their brain's remarkable capacity for change.

The patient's insight about "doing something proactive instead of just worrying" is precisely what you want to hear and amplify. They're discovering that anxiety can be transformed into preparation energy. This shift from passive suffering to active preparation is one of the most powerful outcomes of this work. Help your patients recognize when they're making these psychological breakthroughs.

You can reinforce this by saying: "You just described transforming anxiety into preparation. That's a profound shift in how you relate to stress."

If a patient makes a positive statement like "I think I'm doing better, but it feels forced," their statement can mask self-doubt. For them to have an insight that their affirmations feel forced indicates sophisticated emotional intelligence. Support your patients by helping them understand that forced affirmations reveal self-awareness rather than them being purely aspirational.

If your patient is struggling with the pre-shot routine concept, we suggest you introduce them to Neuro-Linguistic Programming (NLP). NLP is a form of classical conditioning where a unique tactile cue becomes a powerful trigger to recall a specific internal experience. It is used to access positive feelings or manage difficult emotions.

Using a finger-touch anchor: A finger-touch anchor is a specific physical touch—like pressing fingers together or making a fist. This movement, when intentionally linked to a strong emotional or mental state like confidence, calm, or focus, allows you to trigger that desired feeling quickly by simply performing the touch or physical motion. This effectively creates a mental shortcut to the desired emotional states and reduces negative self-talk and self-doubt.

Teaching your patients the finger-touch anchor technique introduces them to a discrete tool they can use anywhere at any time. It's a subtle and effective way to self-regulate. Understanding NLP supports how the pre-shot routine prepares them to get the greatest benefit from the music and breathing exercises they will practice.

Notice how the refined routine that you supported—by focusing on positive self-awareness and ritualistic movement—keeps the patient's successful elements but adds depth and intention.

When you work with your patients to build their pre-shot routine, this is co-creation at its best: honoring their discoveries while offering enhancements to their process. When suggesting improvements, celebrate their growing expertise. An example of a reinforcing and celebratory comment would be: "You're refining this based on what your body is telling you. That's deep self-awareness."

When your patients practice their refined routine, watch for subtle changes in their presence and posture. Often their improvements are visible before they are able or willing to verbalize them. While observing their body language, you might say: "I noticed your shoulders were more relaxed this time." This helps them recognize progress. Giving them feedback that the progress they're making is positive reinforces that they are experiencing greater integration between mind and body. This is the goal: routines that feel purposeful rather than mechanical.

When your patients ask about adapting routines for different situations, it shows they're thinking like practitioners, not just followers. This is exactly what you want. You want your patients to understand they are learning principles they can adapt for use in most any situation.

Help them develop both full versions and stealth versions of their routines. This concept is applicable to everyone. For example, the executive who can do three shoulder rolls and deep breaths in a pattern before a meeting is no different than someone with a ten-minute private routine.

Remember: you're not just refining routines—you're helping patients create personal rituals of empowerment. Every element they choose, every refinement they suggest, increases their ownership and investment in the practice. You can support their choices by creating an atmosphere in your sessions that acknowledges their instincts and supports choices made with their newfound self-awareness.

Your job is to provide options and framework. Theirs is to create something authentic and meaningful that will serve them far beyond these sessions.`
  },
  {
    moduleNumber: 8,
    title: "Session 7: Breathwork",
    transcript: `Sound Bridge Facilitator Training

**Session 7: Breathwork**

*Video Transcript*

*Duration: 7:20 | Presenter: Zola*

Welcome to Session 7 training. You're about to guide patients into one of humanity's most ancient and powerful practices: breathwork. Throughout history, every culture has discovered that our breath truly is our most direct pathway to nervous system regulation. The fact that every culture came to this conclusion independently confirms the universality of breathwork as a tool anyone can use to regulate their nervous system.

Your energy in this session matters enormously. Your patients can often feel vulnerable when they attempt to learn new breathing techniques—worried that they're doing it wrong or feeling self-conscious about focusing on something so basic. Through your own groundedness and respect for the practice, you can create a sense of safety.

When you discuss the historical roots of breathwork, you're doing more than sharing interesting facts—you're helping patients feel connected to something larger than themselves. This isn't just another wellness trend; it's wisdom refined over millennia.

If your patient responds with "Wow, all these ancient cultures discovered this independently," that is the connection you want to foster. Reverence for the practice increases investment in learning.

You may find that some patients have religious or cultural concerns about practices rooted in yoga or meditation. Acknowledge these traditions respectfully while emphasizing the universal physiological benefits of breathwork and how it transcends any particular belief system.

The breath-nervous system connection is invisible to patients until you make it visible. Use simple, concrete language about the vagus nerve and autonomic responses to ensure they easily understand the concepts. Avoid overwhelming them with technical details, but give them enough understanding to trust the process.

Help patients notice their current breathing patterns before teaching new ones. Instruct patients to start with the following: "Put one hand on your chest and one on your belly. Notice which one moves more when you breathe normally." This awareness creates the foundation that will support them as they integrate the Sound Bridge techniques into their daily routines.

The order of teaching breathing techniques matters. Start with diaphragmatic breathing as the foundation—it's gentle and accessible. Diaphragmatic breathing, also known as belly breathing, is a deep, slow breathing technique that uses the diaphragm muscle below your lungs for more efficient oxygen intake. It also helps to reduce stress, improve endurance, and calm the nervous system by engaging the parasympathetic response.

After you establish a solid foundation, you can build complexity gradually. We recommend ending your session with an energizing breath so patients don't leave feeling too sedated. An energizing yoga breath you can use is the Breath of Joy. It begins with a dynamic three-part inhaling process, filling up your lungs from the bottom to the middle to the full lungs through the nose. This is followed by a forceful "ha" exhale through the mouth, often with arm movements, to quickly boost energy.

We'll provide tutorial videos to teach different types of energizing breath techniques that would be appropriate. To bypass any cultural resistance to using these breathing techniques, avoid characterizing them as "yoga breathing." In fact, these techniques do not need to be associated with any belief system or religious practice.

Watch your patients' faces when they practice different breathing techniques. Furrowed brows might indicate confusion or excessive effort. Softening features suggest they're accessing the technique's benefits. Adjust your pacing based on what you observe.

For patients with respiratory issues, anxiety about breath control, or dizziness, offer modifications like shorter holds, gentler ratios, or seated versus lying positions. Nearly every participant will struggle with at least one technique. Normalize this completely. Remind them by saying: "It's supposed to feel unfamiliar. You're retraining patterns you've had for years."

If a patient gets frustrated with alternate nostril breathing finger positions, keep it light when you respond: "Your brain is multitasking—managing breath, fingers, and attention. Practicing these breathing techniques is actually great exercise for self-regulating your nervous system."

Your goal in this session isn't to stress perfection—it's more about self-exploration and discovery of what works for their unique system.

Listen carefully to how your patients describe each technique. If they say "When practicing the box breathing technique, I felt I could organize my thoughts," this suggests that box breathing matches their need for control. Another potential response could be "My mind got very quiet"—this indicates they're accessing meditative states. Use your patients' descriptions of how they feel when practicing breathwork to guide your recommendations.

Some patients will try to intellectualize the experience. Gently redirect them by asking "What are you noticing in your body?" Keep them in felt-sense awareness rather than analytical evaluation.

Common responses you'll encounter are: lightheadedness (reassure them their response is normal), emotional releases (validate this response as natural), difficulty focusing (suggest starting with shorter exercises), and preference for certain techniques (celebrate these discoveries by acknowledging that their self-awareness is improving).

When patients combine breathing techniques with their protocol for the first time, you're facilitating a breakthrough moment. The synergy between breath and music creates something more powerful than either element alone. Notice when their language shifts. They might say "That was more powerful" or "Breathing and listening to music at the same time definitely had a positive effect on me." These types of comments indicate they're experiencing true integration, not just following instructions. This is where the magic of the protocol becomes real for them.

Your patients' week-long assignment between sessions with you is about exploration, not performance. When explaining the purpose of the daily practice, frame the process as a way for them to learn about their own nervous system. Encourage your patients by telling them: "Doing the daily exercises will help you learn what works best for you."

Emphasize that techniques may feel different as they practice—this is evolution, not inconsistency. What feels awkward today might become their favorite technique next week.

If patients report dizziness, reduce intensity and duration. If anxiety increases, return to natural breathing and try shorter practices. If they forget to practice, suggest linking to existing habits like morning coffee or bedtime routine.

Remember: you're not just teaching breathing techniques—you're giving patients direct access to their own nervous system regulation. Every breath they take with awareness is a step toward greater self-mastery and resilience.

Trust the ancient wisdom, trust the modern science, and most importantly, trust your patients' capacity to learn what their bodies need.

Be sure to complete the assessment before moving on to Session 8 training.`
  },
  {
    moduleNumber: 9,
    title: "Session 8: Creating Playlists - The Creative Heart",
    transcript: `Sound Bridge Facilitator Training

**Session 8: Creating Playlists - The Creative Heart of the Process**

*Video Transcript*

*Duration: 6:52 | Presenter: Zola*

Welcome to Session 8 training. This is where the magic happens. Your patients are about to create playlists by combining everything they've learned about tempo, breathing, and emotional states into personalized regulation tools.

This session requires a different facilitator energy. You're moving from being their teacher to being their creative collaborator. Your patients may be new to this type of collaborative process itself. Providing an emotionally safe environment will give them the comfort and security needed to share musical preferences that might make them feel vulnerable or silly. Create that space from the moment the session begins.

When patients reflect on their breathing technique experiences, listen for two things: what worked AND what gaps in effectiveness they're discovering. Often a casually mentioned challenge can serve as an opportunity for them to create a playlist to address that challenge. That's gold.

When your patient shares their experience, notice if they mention transitions from one situation to another—like transitioning from work to home. If they express that as an afterthought, that's gold. Their awareness is increasing. Those spontaneous insights often reveal their most pressing regulation needs. Don't let these moments pass by. Lean into them with curiosity and reassurance.

Common additional needs to explore include: creative blocks, difficult conversations, physical recovery, processing emotions, energy management without caffeine, sleep preparation, and social anxiety.

Here is where many facilitators get nervous: the actual music selection process. Remember, you're not the music expert—you're the regulation expert. Your job isn't to know every song. It's to guide the process of matching music to emotional states.

Start with their current state, not their desired state. For example, if they feel consistently tense at work, ask: "What music matches how you feel when you're stressed out?" Not "What type of music would make you feel calm?" Matching the program variables to their current emotional state creates authentic bridges from one emotional state to another. This avoids jarring transitions when using the program to change their emotional state.

Have descriptions ready for common transitions: high to low energy ("bringing their work-related stress behind them so they can be comfortable at home"), low to high energy ("how to get going in the morning"), moving from being scattered to becoming focused, and moving from a tense state to a state of identifying problem-solving skills they can use to reduce stress and spark creativity.

Some patients will be self-conscious about their musical tastes. Others will want to intellectualize the process. Your job is to keep it feeling focused and judgment-free. If someone says "I don't know much about music," redirect them by reminding them: "You already know what moves you—that's exactly what we need." If they start analyzing genres too much, bring them back to the present: "How does this song make you feel in your body?" and wait for a response.

When working through this process, watch for the moment when their face lights up mentioning a song. That's emotional resonance, and it's more valuable than any perfect tempo match.

This is where your understanding of both breathing and regulation goals becomes crucial. Don't just assign techniques randomly. Help patients feel the logic behind the choices that are being made. For example, box breathing with structured music for focus makes sense—they're both about order and control. Using diaphragmatic breathing with flowing music for transitions will feel natural—they're both about release and movement.

Let your patients suggest pairings of music and breathing techniques first. Their intuition about what feels right is often spot on, and owning the choice increases their investment in the practice.

When patients want to refine earlier playlists, celebrate this as sophistication, not failure. They're developing nuanced understanding of their own regulation patterns. If they express insight about why they should start an anxiety playlist with matching tempo, emphasize that they have crossed into a heightened state of personal awareness. This is huge development. Help them see these insights as advanced emotional intelligence, not just "last week."

Why is this development so significant? Because you're witnessing their regulation skills mature in real time. Be sure to acknowledge their progress and assure them they are doing a good job.

If more suggestions are needed, common refinements you can recommend are: anxiety playlists (gradual tempo shifts versus immediately calm music), focus playlists (instrumental versus vocal music), and energy playlists (sustainable tempos versus abrupt or jarring activation).

When your patient practices together with their new playlist, you're doing more than testing. You're modeling how to notice state changes. Your post-practice question should help them recognize regulation in action. Asking "What did you notice?" is better than "How did that feel?" The first invites observation. The second invites evaluation. The goal is to develop internal awareness, not simply asking them to rate their experiences.

If they mention that sometimes they forget the practice when they're stressed or distracted, reassure them that this is common and normal. "I know that this happens to a lot of people and we can fix that." When you offer reassurance, you create connection and avoid feelings of shame. Help them identify regulation triggers—the specific events or moments in their day when they're experiencing symptoms and think that playlist use would be most beneficial. These concepts become the foundation for sustainable practice habits you'll develop more fully in Session 9.

Asking a closing question about creating additional playlists independently is perfect for building their creative confidence. Give them principles, not rules. You're teaching them to fish, not just providing them with fish. Help them internalize that they're becoming their own regulation experts. Each playlist they create strengthens their understanding of their unique nervous system patterns.

Remember: this session transforms patients from protocol followers into regulation artists. Your enthusiasm for their creative discoveries will fuel their continued experimentation and personal growth. Encourage them to trust their musical instincts, guide their regulation understanding, and watch them create tools they can use for years to come.`
  },
  {
    moduleNumber: 10,
    title: "Session 9: Sustainability & Habit Formation",
    transcript: `Sound Bridge Facilitator Training

**Session 9: Sustainability & Habit Formation**

*Video Transcript*

Welcome to Session 9 training. This is where everything comes together. Your patients have their personalized playlists, they understand the science, and now they're asking the real question: how do I make this stick?

This session isn't just about playlist mechanics—it's about helping people believe they can sustain change. Remember when you first started learning these techniques, that mixture of excitement and doubt? Your patients are feeling exactly that right now.

Pay close attention to the language your patients use when describing their playlist experiences. Are they saying "it worked" or do they say "I made it work"? There's a crucial difference. When someone says "the anxiety playlist helped me before my meeting," gently redirect them. Remind them that this playlist was the result of their conscious choice. "You chose to use the playlist. You created that calm state." This helps create confidence in your patients. You are giving them skills they can use to regulate their nervous system for the rest of their lives.

Also listen for specificity. Vague responses like "it was good" need gentle probing. This can be accomplished by asking "What specifically felt different in your body?" or "When exactly did you notice the shift?" Identifying these details helps them recognize their own regulation patterns.

Here is where many facilitators stumble: they rush through habit formation like it's a checklist. Don't. This conversation can determine whether or not they continue practicing what they've learned or abandon the protocol altogether.

When discussing cue and triggers, get concrete with your examples. Gently suggest that if they say "I'll practice in the morning," that is actually a vague response that gives them an excuse to not practice. An alternative approach would be to explain to them that using different language like saying "Right after I pour my first cup of coffee, before I check email, I'll practice" is a definite call to action that supports their commitment to continue practicing the protocol. The more specific your comments are, the more they buy into being specific. The easier it will be for them to integrate what they have learned into their daily life.

And here's something critical: normalize the struggle. When patients share challenges like "I forgot three days this week," resist the urge to problem-solve immediately. First, validate the feeling. "You have a lot on your plate. Managing everything else in your life is difficult for everyone."

When you discuss brain changes, make it personal and hopeful, not academic. Instead of lecturing about prefrontal cortex changes, try making your comment more personal: "Every time you pair music with intentional breathing, you're literally rewiring your brain to access calm states more easily." Share that even brief, consistent practice creates lasting change. This gives them permission to start small and builds confidence in the process.

Some patients may feel guilty about only doing five-minute practices. Concede this as success, not failure.

This is where your own practice experience becomes invaluable. When someone mentions something that disrupts their routine, you can often share your own use case. Such as, "I keep two or three playlists downloaded offline for exactly that situation." Find an example from your own experience you can use to make this point.

Help them develop what I call abbreviated versions of their practice. For example, explain: "If you can't find fifteen minutes, make an easy commitment to one song with three conscious breaths." Remember: being perfect can easily become the enemy of consistency.

Watch for perfectionist tendencies in your patients. A patient who is overly concerned with "Am I doing the exercise correctly?" could be identified as a perfectionist. Some patients who expect perfection from themselves abandon practicing entirely after missing a few days. Teach them that returning to practice is not evidence of failure. There is no right or wrong here. The value of practicing the protocol is discovering what works best for them, and this may change over time.

This plan isn't just scheduling—it's identity work. As you help patients plan why and when they'll practice, you're helping them see themselves as someone who prioritizes their emotional well-being.

Design the plan specific enough to be actionable but flexible enough to survive real life. Include contingencies: "When you travel, what's your backup plan? During busy seasons, what's your non-negotiable minimum?" The best plan is one that's still doable rather than ambitious. It's better to commit to something sustainable than to over-promise and under-deliver.

When patients share their progress, be sure to celebrate the subtleties in how they express themselves. A seemingly innocuous comment like "I noticed my tension earlier" reflects a huge shift. It shows increased body awareness, which is a foundational regulation skill. Help them recognize changes others have noticed too. When someone mentions their partner commenting on their evening presence, that's external validation of internal work. These observations become powerful motivators.

Encourage simple tracking of their participation: when they practiced, frequency of practice, stress levels, specific playlists used. Keep it light. The goal is awareness, not judgment.

When you practice together in the session, you're modeling how to use the tools in real time. Choose the playlist that matches the way they're feeling at that moment. If they seem energized from discussing progress, maybe use the focus playlist. If they seem overwhelmed by planning, perhaps the anxiety playlist would be more appropriate.

After practice, focus on their body's immediate reaction. Ask them: "What do you notice in your body right now compared to ten minutes ago?" These concrete observations build confidence in the technique's effectiveness.

Your closing this week is crucial. They're going home to test their plan independently. Frame it as an experiment, not a test. Ask them to notice what works, what needs adjusting, and what surprises them. Remind them that the final session will focus on integration and long-term sustainability. This gives them permission to come back with challenges and refinements rather than feeling the need to have it all figured out.

You're preparing them for independence while maintaining connection. That balance—supporting without creating dependence—is the heart of good facilitation.

Trust the process you've guided them through. They have the tools, the understanding, and now the plan. Your job is to believe in their capacity for sustainable change—to support them as they move into a new way of living.`
  }
];

async function updateTranscripts() {
  console.log('📝 Updating module transcripts...\n');
  
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    for (const item of transcripts) {
      await connection.query(
        'UPDATE modules SET transcriptContent = ? WHERE moduleNumber = ?',
        [item.transcript, item.moduleNumber]
      );
      console.log(`✅ Module ${item.moduleNumber}: ${item.title}`);
    }
    
    console.log('\n🎉 All transcripts updated!\n');
    
    // Verify
    const [rows] = await connection.query(
      'SELECT moduleNumber, title, LENGTH(transcriptContent) as transcriptLength FROM modules ORDER BY moduleNumber'
    );
    console.log('Verification (transcript character counts):');
    rows.forEach(m => {
      console.log(`  Module ${m.moduleNumber}: ${m.transcriptLength || 0} characters`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

updateTranscripts();
