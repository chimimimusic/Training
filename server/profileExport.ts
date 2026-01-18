import * as profileDb from './profileDb';

/**
 * Export all trainee profiles to CSV format
 */
export async function exportProfilesToCSV(userIds?: number[]): Promise<string> {
  const profiles = await profileDb.getAllUserProfiles();
  
  // Filter by userIds if provided
  const filteredProfiles = userIds 
    ? profiles.filter(p => userIds.includes(p.id))
    : profiles;

  // CSV headers
  const headers = [
    'ID',
    'Name',
    'Email',
    'Role',
    'Phone',
    'First Name',
    'Last Name',
    'Age',
    'Gender',
    'Street Address',
    'Unit Number',
    'City',
    'State',
    'ZIP Code',
    'Recovery Email',
    'Highest Education',
    'Profile Completed',
    'Status',
    'Created At',
  ];

  // Build CSV rows
  const rows = filteredProfiles.map(profile => [
    profile.id,
    profile.name || '',
    profile.email || '',
    profile.role,
    profile.phone || '',
    profile.firstName || '',
    profile.lastName || '',
    profile.age || '',
    profile.gender || '',
    profile.streetAddress || '',
    profile.unitNumber || '',
    profile.city || '',
    profile.state || '',
    profile.zipCode || '',
    profile.recoveryEmail || '',
    profile.highestEducation || '',
    profile.profileCompletedAt ? new Date(profile.profileCompletedAt).toLocaleDateString() : '',
    profile.status,
    new Date(profile.createdAt).toLocaleDateString(),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Export profiles with education and employment to detailed CSV
 */
export async function exportDetailedProfilesToCSV(userIds?: number[]): Promise<string> {
  const profiles = await profileDb.getAllUserProfiles();
  
  // Filter by userIds if provided
  const filteredProfiles = userIds 
    ? profiles.filter(p => userIds.includes(p.id))
    : profiles;

  // CSV headers
  const headers = [
    'User ID',
    'Name',
    'Email',
    'Phone',
    'Age',
    'Gender',
    'Address',
    'Highest Education',
    'Education History',
    'Employment History',
    'Profile Completed',
    'Status',
  ];

  // Build CSV rows with education and employment
  const rows = await Promise.all(filteredProfiles.map(async profile => {
    // Get full profile with education and employment
    const fullProfile = await profileDb.getUserProfile(profile.id);
    
    const address = [
      profile.streetAddress,
      profile.unitNumber,
      profile.city,
      profile.state,
      profile.zipCode,
    ].filter(Boolean).join(', ');

    const educationHistory = fullProfile?.education
      .map(edu => `${edu.degree} from ${edu.institution}${edu.graduationYear ? ` (${edu.graduationYear})` : ''}`)
      .join('; ') || '';

    const employmentHistory = fullProfile?.employment
      .map(emp => `${emp.jobTitle} at ${emp.employer} (${emp.startDate} - ${emp.isCurrentJob ? 'Present' : emp.endDate || 'N/A'})`)
      .join('; ') || '';

    return [
      profile.id,
      profile.name || '',
      profile.email || '',
      profile.phone || '',
      profile.age || '',
      profile.gender || '',
      address,
      profile.highestEducation || '',
      educationHistory,
      employmentHistory,
      profile.profileCompletedAt ? new Date(profile.profileCompletedAt).toLocaleDateString() : '',
      profile.status,
    ];
  }));

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Format profile data for HTML export
 */
export async function exportProfilesToHTML(userIds?: number[]): Promise<string> {
  const profiles = await profileDb.getAllUserProfiles();
  
  // Filter by userIds if provided
  const filteredProfiles = userIds 
    ? profiles.filter(p => userIds.includes(p.id))
    : profiles;

  const profilesHTML = await Promise.all(filteredProfiles.map(async profile => {
    const fullProfile = await profileDb.getUserProfile(profile.id);
    
    const address = [
      profile.streetAddress,
      profile.unitNumber,
      profile.city,
      profile.state,
      profile.zipCode,
    ].filter(Boolean).join(', ');

    return `
      <div class="profile-card">
        <h2>${profile.name || 'User ' + profile.id}</h2>
        <div class="profile-section">
          <h3>Contact Information</h3>
          <p><strong>Email:</strong> ${profile.email || 'N/A'}</p>
          <p><strong>Phone:</strong> ${profile.phone || 'N/A'}</p>
          <p><strong>Recovery Email:</strong> ${profile.recoveryEmail || 'N/A'}</p>
        </div>
        <div class="profile-section">
          <h3>Personal Information</h3>
          <p><strong>First Name:</strong> ${profile.firstName || 'N/A'}</p>
          <p><strong>Last Name:</strong> ${profile.lastName || 'N/A'}</p>
          <p><strong>Age:</strong> ${profile.age || 'N/A'}</p>
          <p><strong>Gender:</strong> ${profile.gender || 'N/A'}</p>
          <p><strong>Address:</strong> ${address || 'N/A'}</p>
          <p><strong>Highest Education:</strong> ${profile.highestEducation || 'N/A'}</p>
        </div>
        ${fullProfile?.education && fullProfile.education.length > 0 ? `
        <div class="profile-section">
          <h3>Education History</h3>
          <ul>
            ${fullProfile.education.map(edu => `
              <li>
                <strong>${edu.degree}</strong> from ${edu.institution}
                ${edu.fieldOfStudy ? ` - ${edu.fieldOfStudy}` : ''}
                ${edu.graduationYear ? ` (${edu.graduationYear})` : ''}
                ${edu.isCurrentlyEnrolled ? ' (Currently Enrolled)' : ''}
              </li>
            `).join('')}
          </ul>
        </div>
        ` : ''}
        ${fullProfile?.employment && fullProfile.employment.length > 0 ? `
        <div class="profile-section">
          <h3>Employment History</h3>
          <ul>
            ${fullProfile.employment.map(emp => `
              <li>
                <strong>${emp.jobTitle}</strong> at ${emp.employer}<br>
                ${emp.startDate} - ${emp.isCurrentJob ? 'Present' : emp.endDate || 'N/A'}
                ${emp.responsibilities ? `<br><em>${emp.responsibilities}</em>` : ''}
              </li>
            `).join('')}
          </ul>
        </div>
        ` : ''}
        <div class="profile-section">
          <p><strong>Status:</strong> ${profile.status}</p>
          <p><strong>Role:</strong> ${profile.role}</p>
          <p><strong>Profile Completed:</strong> ${profile.profileCompletedAt ? new Date(profile.profileCompletedAt).toLocaleDateString() : 'Incomplete'}</p>
        </div>
      </div>
    `;
  }));

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Trainee Profiles Export</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background: #f5f5f5;
        }
        h1 {
          color: #1e3a5f;
          border-bottom: 3px solid #FA9433;
          padding-bottom: 10px;
        }
        .profile-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          page-break-inside: avoid;
        }
        .profile-card h2 {
          color: #1e3a5f;
          margin-top: 0;
        }
        .profile-section {
          margin: 15px 0;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .profile-section:last-child {
          border-bottom: none;
        }
        .profile-section h3 {
          color: #FA9433;
          font-size: 16px;
          margin: 10px 0;
        }
        .profile-section p {
          margin: 5px 0;
        }
        .profile-section ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        .profile-section li {
          margin: 10px 0;
        }
        @media print {
          body {
            background: white;
          }
          .profile-card {
            box-shadow: none;
            border: 1px solid #ddd;
          }
        }
      </style>
    </head>
    <body>
      <h1>SoundBridge Health - Trainee Profiles</h1>
      <p>Generated on ${new Date().toLocaleString()}</p>
      <p>Total Profiles: ${filteredProfiles.length}</p>
      ${profilesHTML.join('')}
    </body>
    </html>
  `;
}
