import { drizzle } from 'drizzle-orm/mysql2';
import { eq, and } from 'drizzle-orm';
import { assessments } from '../drizzle/schema.ts';
import * as dotenv from 'dotenv';

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

// Assessment data for Sessions 4-7 and 9
const assessmentData = {
  4: {
    title: "Session 4: Music and Memory Connections",
    questions: [
      {
        question: "What will facilitators witness when participants connect music to their memories?",
        options: [
          "Improved technical understanding of musical theory and composition",
          "Faces changing in real-time as they unlock emotional time travel",
          "Better performance on standardized memory assessment tests",
          "Increased ability to analyze and categorize different musical genres",
          "Enhanced focus and concentration during breathing exercises"
        ],
        correctAnswer: 1
      },
      {
        question: "What type of skills does Session 4 require from facilitators?",
        options: [
          "Advanced knowledge of music therapy techniques and interventions",
          "Expertise in memory disorders and cognitive rehabilitation methods",
          "Exquisite listening skills - participants will share vulnerable memories",
          "Technical proficiency with audio equipment and recording devices",
          "Background in neuroscience and brain imaging interpretation"
        ],
        correctAnswer: 2
      },
      {
        question: "What should facilitators avoid when giving verbal reinforcement?",
        options: [
          "Acknowledging any progress until participants demonstrate complete mastery",
          "Using any positive language that might create unrealistic expectations",
          "Generic \"good job\" - be specific about what they're doing well",
          "Celebrating small improvements that might seem insignificant",
          "Any comments that could be interpreted as therapeutic advice"
        ],
        correctAnswer: 2
      },
      {
        question: "What does it indicate when participants say \"It got easier with practice\"?",
        options: [
          "They're becoming compliant with facilitator expectations and instructions",
          "They're developing a new skill, not just following instructions - celebrate as competence building",
          "They're experiencing a placebo effect from repeated exposure",
          "They need more challenging techniques to maintain engagement",
          "They're ready to move on to advanced memory techniques"
        ],
        correctAnswer: 1
      },
      {
        question: "How should facilitators explain music's effect on multiple brain regions?",
        options: [
          "Use detailed neuroanatomical terminology to establish scientific credibility",
          "Focus on technical specifics to help participants understand mechanisms",
          "\"Music activates your emotional brain, memory brain, and rhythm brain all at once\" - goal is awe, not anatomy",
          "Avoid neuroscience explanations entirely as too complex for most participants",
          "Require participants to study brain anatomy before proceeding"
        ],
        correctAnswer: 2
      },
      {
        question: "How should facilitators respond when participants say \"It's almost like time travel\" about the reminiscence bump?",
        options: [
          "Correct their metaphorical language with more scientific terminology",
          "Validate this as normal and remarkable simultaneously - they're describing a neurological phenomenon",
          "Suggest they focus on present-moment experiences rather than past memories",
          "Explain that this feeling is just their imagination and not scientifically valid",
          "Ask them to provide more specific details about their time travel sensation"
        ],
        correctAnswer: 1
      },
      {
        question: "How should facilitators frame dopamine release when explaining why certain songs feel immediately powerful?",
        options: [
          "As evidence of their brain's capacity for healing and regulation - \"Your brain has built-in systems for feeling better\"",
          "Focus on the technical mechanisms of neurotransmitter function",
          "Emphasize that dopamine responses indicate addiction potential",
          "Explain that these responses are temporary and will diminish over time",
          "Suggest that immediate responses are less valuable than gradual changes"
        ],
        correctAnswer: 0
      },
      {
        question: "What should facilitators do when participants share specific memories?",
        options: [
          "Move quickly to the next question to maintain session pacing",
          "Respond with genuine interest and follow-up questions like \"Tell me more about that jazz festival\"",
          "Redirect to more general categories to avoid getting too personal",
          "Document specific details for program evaluation purposes",
          "Compare their memories to other participants' shared experiences"
        ],
        correctAnswer: 1
      },
      {
        question: "How should facilitators handle memories that bring up both positive and negative emotions?",
        options: [
          "Suggest participants focus only on purely positive memories going forward",
          "Recommend they process negative emotions with a separate therapist",
          "Normalize: \"Meaningful memories often carry multiple emotions - that complexity can make them more powerful for regulation\"",
          "Help them separate positive and negative aspects into different categories",
          "Suggest these complex memories are too challenging for this program"
        ],
        correctAnswer: 2
      },
      {
        question: "What does it indicate when participants access full sensory memories like \"I could almost smell the pancakes\"?",
        options: [
          "They're getting distracted from the primary focus on auditory processing",
          "They're accessing multi-sensory activation which makes memory-based regulation potent",
          "They need to focus more specifically on musical elements rather than other senses",
          "They're overthinking the process and need simpler instructions",
          "They should document these responses for interesting case study material"
        ],
        correctAnswer: 1
      }
    ]
  },
  5: {
    title: "Session 5: Playlist Creation and Regulatory Goals",
    questions: [
      {
        question: "What makes Session 5 unique in the program structure?",
        options: [
          "It introduces participants to advanced breathing techniques",
          "It's the creative heart where participants become playlist architects, combining entrainment and memory associations strategically",
          "It focuses primarily on technical equipment and app usage",
          "It emphasizes group activities and peer collaboration",
          "It covers advanced neuroscience concepts in detail"
        ],
        correctAnswer: 1
      },
      {
        question: "What type of facilitation energy does Session 5 require?",
        options: [
          "Strict and disciplinary to maintain focus on technical details",
          "Calm and meditative to support deep introspection",
          "Most creative facilitation energy, moving from teaching concepts to collaborative creation",
          "Analytical and scientific to explain complex theories",
          "Minimal involvement to allow independent participant work"
        ],
        correctAnswer: 2
      },
      {
        question: "What does the observation \"The songs connected to energetic memories made me sit up straighter\" indicate?",
        options: [
          "The participant has poor posture that needs correction",
          "The music volume was too loud during the exercise",
          "Advanced body awareness developing - tracking both emotional and physical responses",
          "The participant was uncomfortable with the musical selections",
          "Technical equipment issues affecting the listening experience"
        ],
        correctAnswer: 2
      },
      {
        question: "How should facilitators approach the regulatory goals conversation?",
        options: [
          "Rush through it quickly to cover all material in the session",
          "Focus only on the most common goals to streamline the process",
          "Don't rush this conversation - their priorities determine which playlists you'll create and in what order",
          "Assign goals based on facilitator expertise rather than participant input",
          "Limit participants to one regulatory goal to maintain simplicity"
        ],
        correctAnswer: 2
      },
      {
        question: "What is the strategic reason for focusing on two goals instead of three when a participant mentions multiple needs?",
        options: [
          "Time constraints within the session format",
          "Participants can't handle more than two concepts simultaneously",
          "Depth over breadth creates more powerful tools than surface-level attempts at everything",
          "Insurance limitations on treatment scope",
          "Facilitator expertise is limited to two areas maximum"
        ],
        correctAnswer: 2
      },
      {
        question: "What makes the participant's insight about memory associations hitting \"faster emotionally\" while tempo affects \"physical state\" significant?",
        options: [
          "It shows they're confused about the basic concepts",
          "It indicates they need more education about neuroscience",
          "It's sophisticated nervous system awareness that should be celebrated as a breakthrough moment",
          "It suggests they're overthinking the process",
          "It demonstrates resistance to the therapeutic approach"
        ],
        correctAnswer: 2
      },
      {
        question: "What makes playlists uniquely powerful according to the anxiety playlist creation example?",
        options: [
          "Using only scientifically proven songs with specific BPM ranges",
          "Including only personal favorites regardless of tempo",
          "The integration of objective scientific criteria (60-80 BPM) with personal significance (meaningful songs)",
          "Focusing exclusively on classical music compositions",
          "Using songs recommended by other participants"
        ],
        correctAnswer: 2
      },
      {
        question: "How should facilitators guide participants who feel overwhelmed by musical choices?",
        options: [
          "Make all selections for them to reduce decision fatigue",
          "Guide them toward quality over quantity - three carefully chosen songs with deep personal resonance are more powerful than ten random selections",
          "Encourage them to include as many songs as possible for variety",
          "Focus only on popular, well-known songs to ensure familiarity",
          "Suggest they postpone playlist creation until they feel more confident"
        ],
        correctAnswer: 1
      },
      {
        question: "What does it indicate when participants practice with newly created playlists and say \"That felt more powerful than before\"?",
        options: [
          "The volume settings were adjusted higher than previous sessions",
          "They're experiencing synergy between multiple elements - evidence of growing expertise in self-regulation",
          "They're trying to please the facilitator with positive feedback",
          "The room acoustics were better during this particular session",
          "They've developed a placebo effect from the playlist creation process"
        ],
        correctAnswer: 1
      },
      {
        question: "What does the insight about needing a \"bridge\" - starting with matching emotions then gradually shifting - demonstrate?",
        options: [
          "Participants are making the process more complicated than necessary",
          "The protocol design has fundamental flaws that need correction",
          "Sophisticated emotional intelligence - many can't jump directly from anxiety to calm but need transitional steps",
          "Participants lack commitment to following instructions precisely",
          "The musical selections were inappropriate for the intended goals"
        ],
        correctAnswer: 2
      }
    ]
  },
  6: {
    title: "Session 6: Pre-Shot Routines and Personalized Rituals",
    questions: [
      {
        question: "How should facilitators view pre-shot routines according to Session 6?",
        options: [
          "As simple sequences of actions that participants must follow exactly",
          "As bridges between chaos and calm, between anxiety and capability",
          "As temporary techniques to be discarded once participants improve",
          "As standardized procedures that work the same for everyone",
          "As basic warm-up exercises before the real therapeutic work begins"
        ],
        correctAnswer: 1
      },
      {
        question: "What transformation occurs for participants in Session 6?",
        options: [
          "From individual work to group activities and peer support",
          "From basic techniques to advanced neuroscience understanding",
          "From following instructions to creating personalized rituals that will serve them for years",
          "From music-based interventions to movement-focused approaches",
          "From weekly sessions to daily intensive practice requirements"
        ],
        correctAnswer: 2
      },
      {
        question: "What does it indicate when a participant says \"My brain recognized it as a signal\"?",
        options: [
          "They're confused about the basic concepts being taught",
          "They're developing state-dependent learning and becoming regulation experts",
          "They need more education about how the brain functions",
          "They're experiencing technical difficulties with the audio equipment",
          "They're overthinking the process and need to simplify their approach"
        ],
        correctAnswer: 1
      },
      {
        question: "How should facilitators interpret a participant's complaint about feeling \"rushed through\" the routine?",
        options: [
          "As resistance that needs to be overcome with firmer guidance",
          "As a sign they're not ready for this level of intervention",
          "As gold - showing investment, not resistance; they want to engage more fully",
          "As feedback that the routine is too complex and needs simplification",
          "As an indication that session timing needs to be adjusted"
        ],
        correctAnswer: 2
      },
      {
        question: "What is the primary purpose of connecting pre-shot routines to sports psychology?",
        options: [
          "To make the content more academically interesting and credible",
          "To give participants permission to take themselves seriously - their daily challenges deserve intentional preparation",
          "To establish the facilitator's expertise in multiple therapeutic domains",
          "To prepare participants for advanced athletic performance training",
          "To differentiate this approach from traditional psychotherapy methods"
        ],
        correctAnswer: 1
      },
      {
        question: "What does the participant's insight about \"doing something proactive instead of just worrying\" represent?",
        options: [
          "A basic understanding that needs further development",
          "Resistance to accepting their anxiety as normal",
          "A profound shift from passive suffering to active preparation - transforming anxiety into preparation energy",
          "Confusion about the difference between worry and productive planning",
          "An attempt to avoid dealing with underlying emotional issues"
        ],
        correctAnswer: 2
      },
      {
        question: "How should facilitators present neurological explanations about routine practice?",
        options: [
          "Using technical jargon about neural plasticity to establish scientific credibility",
          "Keeping explanations personal and hopeful: \"Every time you practice, you're carving a pathway to calm\"",
          "Avoiding neuroscience entirely to prevent overwhelming participants",
          "Focusing on complex brain anatomy to help participants understand mechanisms",
          "Emphasizing the permanence of neural changes to motivate consistent practice"
        ],
        correctAnswer: 1
      },
      {
        question: "When analyzing a participant's current routine, what should facilitators prioritize?",
        options: [
          "Identifying all the missing components that need to be added",
          "Comparing their routine to the standard protocol requirements",
          "Looking for what's already working rather than what's missing - build on strengths first",
          "Correcting any deviations from the prescribed routine elements",
          "Measuring their progress against other participants in the program"
        ],
        correctAnswer: 2
      },
      {
        question: "How should facilitators respond when participants say affirmations feel \"forced\"?",
        options: [
          "Encourage them to practice the affirmations more frequently until they feel natural",
          "Explain that discomfort with affirmations indicates deeper psychological resistance",
          "Help them understand that authentic affirmations meet them where they are, not where they think they should be",
          "Suggest they eliminate affirmations entirely from their routine",
          "Provide a list of universally effective affirmations to replace their current ones"
        ],
        correctAnswer: 2
      },
      {
        question: "What represents \"co-creation at its best\" in routine development?",
        options: [
          "Facilitators designing completely new routines based on their professional expertise",
          "Participants following predetermined routines without any modifications",
          "Maintaining the participant's successful elements while adding depth and intention",
          "Groups of participants collaborating to create shared routine protocols",
          "Using standardized routines that have been validated through research studies"
        ],
        correctAnswer: 2
      }
    ]
  },
  7: {
    title: "Session 7: Breathwork Fundamentals",
    questions: [
      {
        question: "Why is breathwork described as humanity's \"most ancient and powerful practice\"?",
        options: [
          "It requires no equipment or technology to implement effectively",
          "Every culture discovered breathwork independently because it's our most direct pathway to nervous system regulation",
          "It's the only practice that works equally well for all personality types",
          "Ancient texts provide detailed scientific explanations of its mechanisms",
          "It's the foundation for all other therapeutic and wellness interventions"
        ],
        correctAnswer: 1
      },
      {
        question: "Why does facilitator energy matter enormously in Session 7?",
        options: [
          "Breathing techniques require high energy to demonstrate proper execution",
          "Participants need energetic motivation to overcome initial resistance",
          "Participants often feel vulnerable learning breathing techniques - create safety through groundedness and respect",
          "The session covers more content than previous sessions require sustained energy",
          "Group breathing exercises require synchronized energy from the facilitator"
        ],
        correctAnswer: 2
      },
      {
        question: "What is the deeper purpose of discussing breathwork's historical roots?",
        options: [
          "To establish the scientific credibility of the techniques being taught",
          "To help participants feel connected to something larger than themselves - it's wisdom refined over millennia",
          "To differentiate this approach from modern therapeutic interventions",
          "To provide interesting background information that increases engagement",
          "To justify the time investment required for mastering breathing techniques"
        ],
        correctAnswer: 1
      },
      {
        question: "How should facilitators address participants with religious or cultural concerns about breathwork practices?",
        options: [
          "Avoid mentioning any historical or cultural connections to prevent discomfort",
          "Focus exclusively on the scientific aspects without acknowledging traditions",
          "Acknowledge these traditions respectfully while emphasizing universal physiological benefits that transcend belief systems",
          "Refer participants to alternative programs that don't include breathwork",
          "Suggest they consult with their religious leaders before continuing"
        ],
        correctAnswer: 2
      },
      {
        question: "What is the recommended approach for helping participants notice current breathing patterns?",
        options: [
          "Use complex measurement devices to provide objective breathing data",
          "\"Put one hand on your chest, one on your belly. Notice which moves more when you breathe normally.\"",
          "Have them count their breaths per minute and compare to normal ranges",
          "Focus immediately on teaching new techniques without assessment",
          "Ask them to describe their breathing patterns in written form"
        ],
        correctAnswer: 1
      },
      {
        question: "What is the strategic reason for the specific order of breathing techniques?",
        options: [
          "To match the complexity progression used in research studies",
          "Start with diaphragmatic breathing as foundation, build complexity gradually, end with energizing breath",
          "To ensure participants master each technique before moving to the next",
          "To follow the historical development sequence of breathing practices",
          "To maintain consistent timing and pacing throughout the session"
        ],
        correctAnswer: 1
      },
      {
        question: "What should facilitators watch for during breathing technique practice?",
        options: [
          "Perfect technical execution and adherence to timing instructions",
          "Participants' faces - furrowed brows indicate confusion, softening features suggest accessing benefits",
          "Completion speed and efficiency in learning each technique",
          "Verbal feedback and questions about technique difficulty",
          "Breathing rate measurements and physiological changes"
        ],
        correctAnswer: 1
      },
      {
        question: "How should facilitators respond when participants struggle with techniques?",
        options: [
          "Provide additional practice time until they achieve technical mastery",
          "Suggest they may not be ready for breathwork interventions",
          "Normalize completely: \"It's supposed to feel unfamiliar - you're retraining patterns you've had for years\"",
          "Move them to simpler techniques until they build foundational skills",
          "Recommend individual coaching sessions to address specific difficulties"
        ],
        correctAnswer: 2
      },
      {
        question: "How should facilitators interpret participants' descriptions of their breathing experiences?",
        options: [
          "Focus only on positive responses to maintain motivation and engagement",
          "\"It felt organizing\" suggests box breathing matches their need for control - descriptions guide recommendations",
          "Encourage more detailed technical analysis of their physiological responses",
          "Compare their experiences to typical responses from other participants",
          "Document responses for program evaluation and research purposes"
        ],
        correctAnswer: 1
      },
      {
        question: "What should facilitators do when participants try to intellectualize their breathing experiences?",
        options: [
          "Encourage deeper analytical thinking to enhance their understanding",
          "Provide more scientific explanations to satisfy their intellectual curiosity",
          "Gently redirect: \"What did you notice in your body?\" - keep them in felt-sense awareness",
          "Use their intellectual interest to teach advanced breathing theory",
          "Suggest they research the neuroscience of breathing for homework"
        ],
        correctAnswer: 2
      }
    ]
  },
  9: {
    title: "Session 9: Sustaining Change and Habit Formation",
    questions: [
      {
        question: "What is the central focus of Session 9?",
        options: [
          "Teaching advanced breathing techniques and complex musical theory",
          "Helping people believe they can sustain change - \"How do I make this stick?\"",
          "Evaluating participants' progress and measuring program effectiveness",
          "Introducing new playlist creation tools and technology platforms",
          "Preparing participants for advanced facilitator training opportunities"
        ],
        correctAnswer: 1
      },
      {
        question: "What crucial difference should facilitators listen for in participants' language?",
        options: [
          "Technical accuracy in describing breathing patterns and music selection",
          "Whether they're saying \"it worked\" or \"I made it work\"",
          "Complaints about program difficulty versus expressions of satisfaction",
          "References to scientific concepts learned versus emotional experiences",
          "Comparisons to other participants' progress and achievements"
        ],
        correctAnswer: 1
      },
      {
        question: "How should facilitators redirect when someone says \"The anxiety playlist helped before my meeting\"?",
        options: [
          "Ask for more specific details about which songs were most effective",
          "Suggest they document this success for future reference and tracking",
          "\"You chose to use the playlist and paired it with breathing. You created that calm state.\"",
          "Recommend they share this success story with other program participants",
          "Explore what other situations might benefit from the same playlist"
        ],
        correctAnswer: 2
      },
      {
        question: "What is the most common mistake facilitators make regarding habit formation?",
        options: [
          "Spending too much time on theoretical background instead of practical application",
          "They rush through habit formation like it's a checklist",
          "Focusing too heavily on participants' past failures with habit building",
          "Not providing enough scientific evidence for why habits are important",
          "Comparing participants' habit-building challenges to each other"
        ],
        correctAnswer: 1
      },
      {
        question: "How should facilitators approach cue and trigger discussions?",
        options: [
          "Keep them general and flexible to accommodate different lifestyles",
          "Focus on internal mental cues rather than external environmental triggers",
          "Get concrete: \"Right after I pour my first cup of coffee, before I check email\"",
          "Suggest the same triggers that have worked for other participants",
          "Emphasize timing over specific actions for maximum flexibility"
        ],
        correctAnswer: 2
      },
      {
        question: "How should facilitators respond when participants share challenges like \"I forgot three days this week\"?",
        options: [
          "Immediately provide problem-solving strategies to prevent future forgetting",
          "First validate: \"Building new habits while managing everything else in your life is genuinely difficult\"",
          "Suggest they set more reminders and alarms to improve consistency",
          "Explore what underlying resistance might be causing the forgetting",
          "Recommend they reduce their practice goals to more manageable levels"
        ],
        correctAnswer: 1
      },
      {
        question: "How should facilitators discuss neuroplasticity and brain changes?",
        options: [
          "Use technical terminology to establish scientific credibility and expertise",
          "Focus on academic research findings and peer-reviewed studies",
          "Make it personal and hopeful: \"You're literally rewiring your brain to access calm states more easily\"",
          "Avoid the topic entirely as too complex for most participants",
          "Emphasize that significant brain changes require months of intensive practice"
        ],
        correctAnswer: 2
      },
      {
        question: "What should facilitators help participants develop for troubleshooting barriers?",
        options: [
          "Comprehensive backup plans for every possible disruption scenario",
          "Both full and abbreviated versions of their practice",
          "Detailed schedules that account for travel and busy periods",
          "Accountability partnerships with other program participants",
          "Professional support contacts for challenging periods"
        ],
        correctAnswer: 1
      },
      {
        question: "What is the deeper purpose of creating maintenance plans?",
        options: [
          "To ensure compliance with program requirements and recommendations",
          "It's identity work - helping them see themselves as someone who prioritizes emotional wellbeing",
          "To provide facilitators with data about long-term program effectiveness",
          "To create structure that prevents participants from modifying techniques",
          "To establish clear boundaries between guided practice and independent work"
        ],
        correctAnswer: 1
      },
      {
        question: "What should facilitators celebrate when participants share progress?",
        options: [
          "Only major breakthroughs and significant measurable improvements",
          "Technical mastery and perfect execution of all learned techniques",
          "The subtleties: \"I noticed my tension earlier\" is increased body awareness",
          "Consistency in practice frequency and duration over time",
          "Comparisons showing improvement relative to other participants"
        ],
        correctAnswer: 2
      }
    ]
  }
};

async function updateAssessments() {
  console.log('🔄 Updating assessments for Sessions 4, 5, 6, 7, and 9...\n');

  for (const [moduleId, data] of Object.entries(assessmentData)) {
    const moduleNum = parseInt(moduleId);
    console.log(`Processing Module ${moduleNum}: ${data.title}`);

    // Delete existing assessments for this module
    await db.delete(assessments).where(eq(assessments.moduleId, moduleNum));
    console.log(`  ✅ Cleared existing assessments`);

    // Insert new assessments
    for (const [index, q] of data.questions.entries()) {
      await db.insert(assessments).values({
        moduleId: moduleNum,
        questionNumber: index + 1,
        questionText: q.question,
        questionType: 'multiple_choice',
        options: JSON.stringify(q.options),
        correctAnswer: q.correctAnswer.toString(),
        points: 10
      });
    }
    console.log(`  ✅ Inserted ${data.questions.length} questions, ${data.questions.length * 10} points total\n`);
  }

  console.log('🎉 Assessment updates complete!');
  console.log('   - Module 4: 10 questions, 100 points total');
  console.log('   - Module 5: 10 questions, 100 points total');
  console.log('   - Module 6: 10 questions, 100 points total');
  console.log('   - Module 7: 10 questions, 100 points total');
  console.log('   - Module 9: 10 questions, 100 points total');
  
  process.exit(0);
}

updateAssessments().catch((error) => {
  console.error('❌ Error updating assessments:', error);
  process.exit(1);
});
