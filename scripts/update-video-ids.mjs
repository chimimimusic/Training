import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Just the video IDs extracted from the YouTube URLs
const videoUpdates = [
  { moduleNumber: 1, videoId: 'iwPnLcsSkqc' },   // Session 1
  { moduleNumber: 2, videoId: 'SWPSDYx3Xes' },   // Session 1B
  { moduleNumber: 3, videoId: 'fEEbuk-KnhM' },   // Session 2
  { moduleNumber: 4, videoId: 'fpLFg6j5neo' },   // Session 3
  { moduleNumber: 5, videoId: 'rv9mKx2QCdE' },   // Session 4
  { moduleNumber: 6, videoId: '-4AdTnf2FBY' },   // Session 5
  { moduleNumber: 7, videoId: '_oWrYJt-zQ8' },   // Session 6
  { moduleNumber: 8, videoId: 'mdOXrGSbNkc' },   // Session 7
  { moduleNumber: 9, videoId: 'ciFoGuKcQQU' },   // Session 8
  { moduleNumber: 10, videoId: '_4d05Mp6_ZE' },  // Session 9
];

async function updateVideoIds() {
  console.log('🎬 Updating YouTube video IDs...\n');
  
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    // Update each module's video ID using moduleNumber
    for (const update of videoUpdates) {
      await connection.query(
        'UPDATE modules SET youtubeVideoId = ? WHERE moduleNumber = ?',
        [update.videoId, update.moduleNumber]
      );
      console.log(`✅ Module ${update.moduleNumber}: ${update.videoId}`);
    }
    
    console.log('\n🎉 All video IDs updated!\n');
    
    // Verify
    const [rows] = await connection.query('SELECT moduleNumber, title, youtubeVideoId FROM modules ORDER BY moduleNumber');
    console.log('Verification:');
    rows.forEach(m => {
      console.log(`  Module ${m.moduleNumber}: ${m.youtubeVideoId}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

updateVideoIds();
