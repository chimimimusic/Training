import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

const videoUpdates = [
  { module: 1, url: 'https://youtu.be/iwPnLcsSkqc' },   // Session 1
  { module: 2, url: 'https://youtu.be/SWPSDYx3Xes' },   // Session 1B
  { module: 3, url: 'https://youtu.be/fEEbuk-KnhM' },   // Session 2
  { module: 4, url: 'https://youtu.be/fpLFg6j5neo' },   // Session 3
  { module: 5, url: 'https://youtu.be/rv9mKx2QCdE' },   // Session 4
  { module: 6, url: 'https://youtu.be/-4AdTnf2FBY' },   // Session 5
  { module: 7, url: 'https://youtu.be/_oWrYJt-zQ8' },   // Session 6
  { module: 8, url: 'https://youtu.be/mdOXrGSbNkc' },   // Session 7
  { module: 9, url: 'https://youtu.be/ciFoGuKcQQU' },   // Session 8
  { module: 10, url: 'https://youtu.be/_4d05Mp6_ZE' },  // Session 9
];

async function updateVideoUrls() {
  console.log('🎬 Updating video URLs...\n');
  
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    // First, let's see what tables and columns we have
    const [tables] = await connection.query('SHOW TABLES');
    console.log('Tables in database:', tables);
    
    // Check if there's a modules table
    const [moduleRows] = await connection.query('SELECT * FROM modules ORDER BY id');
    console.log('\nCurrent modules:');
    moduleRows.forEach(m => {
      console.log(`  Module ${m.id}: ${m.title} - Video: ${m.videoUrl || m.video_url || 'N/A'}`);
    });
    
    // Update each module's video URL
    console.log('\n📝 Updating video URLs...');
    for (const update of videoUpdates) {
      // Try both column name conventions
      try {
        await connection.query(
          'UPDATE modules SET videoUrl = ? WHERE id = ?',
          [update.url, update.module]
        );
        console.log(`  ✅ Module ${update.module}: ${update.url}`);
      } catch (e) {
        // Try snake_case if camelCase fails
        await connection.query(
          'UPDATE modules SET video_url = ? WHERE id = ?',
          [update.url, update.module]
        );
        console.log(`  ✅ Module ${update.module}: ${update.url}`);
      }
    }
    
    console.log('\n🎉 All video URLs updated successfully!');
    
    // Verify the updates
    const [updatedRows] = await connection.query('SELECT id, title, videoUrl, video_url FROM modules ORDER BY id');
    console.log('\nVerification - Updated modules:');
    updatedRows.forEach(m => {
      console.log(`  Module ${m.id}: ${m.videoUrl || m.video_url}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

updateVideoUrls();
