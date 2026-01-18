import { storagePut } from './storage';
import { nanoid } from 'nanoid';

/**
 * Generate a completion certificate PDF for a trainee
 * Returns the S3 URL of the generated certificate
 */
export async function generateCertificate(params: {
  traineeName: string;
  completionDate: Date;
  averageScore: number;
  certificateId: string;
}): Promise<{ url: string; key: string }> {
  const { traineeName, completionDate, averageScore, certificateId } = params;
  
  // Create SVG certificate design
  const certificateSVG = `
<svg width="1200" height="900" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="900" fill="#0B3F87"/>
  
  <!-- Border -->
  <rect x="40" y="40" width="1120" height="820" fill="none" stroke="#FA9433" stroke-width="4"/>
  <rect x="50" y="50" width="1100" height="800" fill="none" stroke="#FA9433" stroke-width="2"/>
  
  <!-- Header -->
  <text x="600" y="150" font-family="Georgia, serif" font-size="48" fill="#FFFFFF" text-anchor="middle" font-weight="bold">
    CERTIFICATE OF COMPLETION
  </text>
  
  <!-- Organization -->
  <text x="600" y="200" font-family="Arial, sans-serif" font-size="24" fill="#FA9433" text-anchor="middle">
    SoundBridge Health
  </text>
  
  <!-- Divider -->
  <line x1="300" y1="230" x2="900" y2="230" stroke="#FA9433" stroke-width="2"/>
  
  <!-- This certifies text -->
  <text x="600" y="290" font-family="Arial, sans-serif" font-size="20" fill="#FFFFFF" text-anchor="middle">
    This certifies that
  </text>
  
  <!-- Trainee Name -->
  <text x="600" y="360" font-family="Georgia, serif" font-size="42" fill="#FA9433" text-anchor="middle" font-weight="bold">
    ${traineeName}
  </text>
  
  <!-- Achievement text -->
  <text x="600" y="430" font-family="Arial, sans-serif" font-size="20" fill="#FFFFFF" text-anchor="middle">
    has successfully completed the
  </text>
  
  <!-- Program name -->
  <text x="600" y="480" font-family="Georgia, serif" font-size="28" fill="#FFFFFF" text-anchor="middle" font-weight="bold">
    Facilitator Training Program
  </text>
  
  <!-- Description -->
  <text x="600" y="530" font-family="Arial, sans-serif" font-size="18" fill="#FFFFFF" text-anchor="middle">
    Demonstrating proficiency in music-based intervention techniques
  </text>
  <text x="600" y="560" font-family="Arial, sans-serif" font-size="18" fill="#FFFFFF" text-anchor="middle">
    and clinical application of the SoundBridge Health protocol
  </text>
  
  <!-- Stats -->
  <text x="400" y="640" font-family="Arial, sans-serif" font-size="16" fill="#FA9433" text-anchor="middle">
    Average Score
  </text>
  <text x="400" y="670" font-family="Arial, sans-serif" font-size="24" fill="#FFFFFF" text-anchor="middle" font-weight="bold">
    ${averageScore}%
  </text>
  
  <text x="800" y="640" font-family="Arial, sans-serif" font-size="16" fill="#FA9433" text-anchor="middle">
    Completion Date
  </text>
  <text x="800" y="670" font-family="Arial, sans-serif" font-size="24" fill="#FFFFFF" text-anchor="middle" font-weight="bold">
    ${completionDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
  </text>
  
  <!-- Certificate ID -->
  <text x="600" y="760" font-family="Arial, sans-serif" font-size="14" fill="#FFFFFF" text-anchor="middle" opacity="0.7">
    Certificate ID: ${certificateId}
  </text>
  
  <!-- Footer -->
  <text x="600" y="820" font-family="Arial, sans-serif" font-size="16" fill="#FA9433" text-anchor="middle" font-style="italic">
    Certified Facilitator of Music-Based Interventions
  </text>
</svg>
  `.trim();
  
  // Convert SVG to buffer
  const svgBuffer = Buffer.from(certificateSVG, 'utf-8');
  
  // Generate unique filename
  const fileName = `certificate-${certificateId}.svg`;
  const fileKey = `certificates/${fileName}`;
  
  // Upload to S3
  const result = await storagePut(fileKey, svgBuffer, 'image/svg+xml');
  
  return result;
}

/**
 * Check if user has completed all modules and calculate average score
 */
export function calculateCertificateEligibility(userProgress: Array<{
  moduleId: number;
  status: string;
  assessmentScore: number | null;
}>): {
  eligible: boolean;
  averageScore: number;
  completedModules: number;
} {
  const totalModules = 10;
  const completedModules = userProgress.filter(p => p.status === 'completed').length;
  
  if (completedModules < totalModules) {
    return {
      eligible: false,
      averageScore: 0,
      completedModules
    };
  }
  
  // Calculate average score
  const scores = userProgress
    .filter(p => p.assessmentScore !== null)
    .map(p => p.assessmentScore as number);
  
  if (scores.length === 0) {
    return {
      eligible: false,
      averageScore: 0,
      completedModules
    };
  }
  
  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  const averageScore = Math.round(totalScore / scores.length);
  
  return {
    eligible: true,
    averageScore,
    completedModules
  };
}
