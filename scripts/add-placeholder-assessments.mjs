import { drizzle } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import { assessments, modules } from '../drizzle/schema.ts';
import * as dotenv from 'dotenv';

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

// Placeholder assessment questions for modules without finalized content
const placeholderQuestions = {
  // Module 1B (if it exists as a separate module)
  // For now, we'll create questions for modules 8 and 10
  8: [
    {
      question: "This is a placeholder question for Session 8. What key concept will be covered in this session?",
      options: [
        "Placeholder option A",
        "Placeholder option B - Correct answer",
        "Placeholder option C",
        "Placeholder option D"
      ],
      correctAnswer: 1
    },
    {
      question: "Placeholder question 2 for Session 8. Which technique is most important?",
      options: [
        "Technique A",
        "Technique B",
        "Technique C - Correct answer",
        "Technique D"
      ],
      correctAnswer: 2
    },
    {
      question: "Placeholder question 3 for Session 8. How should facilitators approach this topic?",
      options: [
        "Approach A - Correct answer",
        "Approach B",
        "Approach C",
        "Approach D"
      ],
      correctAnswer: 0
    },
    {
      question: "Placeholder question 4 for Session 8. What is the primary goal?",
      options: [
        "Goal A",
        "Goal B",
        "Goal C",
        "Goal D - Correct answer"
      ],
      correctAnswer: 3
    },
    {
      question: "Placeholder question 5 for Session 8. Which statement is true?",
      options: [
        "Statement A",
        "Statement B - Correct answer",
        "Statement C",
        "Statement D"
      ],
      correctAnswer: 1
    },
    {
      question: "Placeholder question 6 for Session 8. What should be avoided?",
      options: [
        "Action A - Correct answer",
        "Action B",
        "Action C",
        "Action D"
      ],
      correctAnswer: 0
    },
    {
      question: "Placeholder question 7 for Session 8. How do you respond to participants?",
      options: [
        "Response A",
        "Response B",
        "Response C - Correct answer",
        "Response D"
      ],
      correctAnswer: 2
    },
    {
      question: "Placeholder question 8 for Session 8. What is best practice?",
      options: [
        "Practice A",
        "Practice B",
        "Practice C",
        "Practice D - Correct answer"
      ],
      correctAnswer: 3
    },
    {
      question: "Placeholder question 9 for Session 8. Which element is essential?",
      options: [
        "Element A - Correct answer",
        "Element B",
        "Element C",
        "Element D"
      ],
      correctAnswer: 0
    },
    {
      question: "Placeholder question 10 for Session 8. What represents success?",
      options: [
        "Success indicator A",
        "Success indicator B - Correct answer",
        "Success indicator C",
        "Success indicator D"
      ],
      correctAnswer: 1
    }
  ],
  10: [
    {
      question: "This is a placeholder question for Session 10. What key concept will be covered in this final session?",
      options: [
        "Placeholder option A",
        "Placeholder option B - Correct answer",
        "Placeholder option C",
        "Placeholder option D"
      ],
      correctAnswer: 1
    },
    {
      question: "Placeholder question 2 for Session 10. Which technique is most important for program completion?",
      options: [
        "Technique A",
        "Technique B",
        "Technique C - Correct answer",
        "Technique D"
      ],
      correctAnswer: 2
    },
    {
      question: "Placeholder question 3 for Session 10. How should facilitators approach the final session?",
      options: [
        "Approach A - Correct answer",
        "Approach B",
        "Approach C",
        "Approach D"
      ],
      correctAnswer: 0
    },
    {
      question: "Placeholder question 4 for Session 10. What is the primary goal of the final session?",
      options: [
        "Goal A",
        "Goal B",
        "Goal C",
        "Goal D - Correct answer"
      ],
      correctAnswer: 3
    },
    {
      question: "Placeholder question 5 for Session 10. Which statement about program completion is true?",
      options: [
        "Statement A",
        "Statement B - Correct answer",
        "Statement C",
        "Statement D"
      ],
      correctAnswer: 1
    },
    {
      question: "Placeholder question 6 for Session 10. What should be emphasized in closing?",
      options: [
        "Action A - Correct answer",
        "Action B",
        "Action C",
        "Action D"
      ],
      correctAnswer: 0
    },
    {
      question: "Placeholder question 7 for Session 10. How do you support ongoing practice?",
      options: [
        "Response A",
        "Response B",
        "Response C - Correct answer",
        "Response D"
      ],
      correctAnswer: 2
    },
    {
      question: "Placeholder question 8 for Session 10. What is best practice for program conclusion?",
      options: [
        "Practice A",
        "Practice B",
        "Practice C",
        "Practice D - Correct answer"
      ],
      correctAnswer: 3
    },
    {
      question: "Placeholder question 9 for Session 10. Which element is essential for long-term success?",
      options: [
        "Element A - Correct answer",
        "Element B",
        "Element C",
        "Element D"
      ],
      correctAnswer: 0
    },
    {
      question: "Placeholder question 10 for Session 10. What represents successful program completion?",
      options: [
        "Success indicator A",
        "Success indicator B - Correct answer",
        "Success indicator C",
        "Success indicator D"
      ],
      correctAnswer: 1
    }
  ]
};

async function addPlaceholderAssessments() {
  console.log('🔄 Adding placeholder assessment questions for modules 8 and 10...\n');

  for (const [moduleId, questions] of Object.entries(placeholderQuestions)) {
    const modId = parseInt(moduleId);
    
    // Delete existing assessments
    await db.delete(assessments).where(eq(assessments.moduleId, modId));
    console.log(`  ✅ Cleared existing Module ${modId} assessments`);

    // Insert new placeholder assessments
    for (const [index, q] of questions.entries()) {
      await db.insert(assessments).values({
        moduleId: modId,
        questionNumber: index + 1,
        questionText: q.question,
        questionType: 'multiple_choice',
        options: JSON.stringify(q.options),
        correctAnswer: q.correctAnswer.toString(),
        points: 10
      });
    }
    console.log(`  ✅ Inserted ${questions.length} placeholder questions for Module ${modId}, ${questions.length * 10} points total\n`);
  }

  console.log('🎉 Placeholder assessment update complete!');
  console.log('   - Module 8: 10 placeholder questions, 100 points total');
  console.log('   - Module 10: 10 placeholder questions, 100 points total');
  console.log('   - Passing score: 80% (80 points minimum)\n');
  console.log('⚠️  NOTE: These are placeholder questions. Replace with actual content when available.\n');
  
  process.exit(0);
}

addPlaceholderAssessments().catch((error) => {
  console.error('❌ Error adding placeholder assessments:', error);
  process.exit(1);
});
