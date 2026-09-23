/**
 * MNK Remodeling — Projects
 * ==========================
 * This is the ONLY file you need to touch to add a new project.
 *
 * HOW TO ADD A NEW PROJECT (3 steps):
 *
 * 1. Make a new folder inside images/projects/  — name it anything,
 *    no spaces (e.g. "smith-kitchen-2026").
 *
 * 2. Put your photos in that folder named 1.jpg, 2.jpg, 3.jpg, and so on
 *    in order. Photo 1 is used as the cover photo on the project card.
 *    (JPG or PNG both work — just keep the numbers, keep the extension
 *    matching what you actually saved, .jpg or .png, and update "ext"
 *    below if you used .png instead of .jpg.)
 *
 * 3. Copy one block below, paste it into the list, and fill in:
 *      service  -> which tab it shows up on: 'bathroom', 'kitchen',
 *                  'basement', 'carpentry', 'flooring', or 'whole-home'
 *      title    -> short project name shown on the card
 *      location -> city or neighborhood (or leave as '')
 *      folder   -> the folder name you made in step 1
 *      count    -> how many photos you put in that folder
 *      ext      -> 'jpg' or 'png' (whatever your photos are saved as)
 *
 * That's it. Save the file, upload it along with your new images/projects/
 * folder — the site builds the project card and the click-to-open photo
 * gallery automatically from this list. Nothing else to edit.
 */

const PROJECTS = [
  { service: 'bathroom', title: 'Primary Suite Remodel', location: 'Aurora, IL', folder: 'primary-suite-remodel', count: 13, ext: 'jpg' },
  { service: 'bathroom', title: 'Guest Bath Update', location: '', folder: 'guest-bath-update', count: 13, ext: 'jpg' },
  { service: 'bathroom', title: 'Bath Remodel — Demo Phase', location: '', folder: 'bath-demo-phase', count: 8, ext: 'jpg' },
  { service: 'bathroom', title: 'Double-Vanity Bath', location: '', folder: 'double-vanity-bath', count: 11, ext: 'jpg' },
  { service: 'bathroom', title: 'Tub & Shower Refresh', location: '', folder: 'tub-shower-refresh', count: 6, ext: 'jpg' },
  { service: 'bathroom', title: 'Classic Bath Update', location: '', folder: 'classic-bath-update', count: 5, ext: 'jpg' },

  { service: 'kitchen', title: 'Modern Marble Kitchen', location: '', folder: 'modern-marble-kitchen', count: 1, ext: 'jpg' },
  { service: 'kitchen', title: 'Bright White Kitchen', location: '', folder: 'bright-white-kitchen', count: 2, ext: 'jpg' },

  { service: 'carpentry', title: 'Living & Dining Room Update', location: '', folder: 'living-dining-update', count: 2, ext: 'jpg' },
  { service: 'carpentry', title: 'Stairs & Fireplace Refresh', location: '', folder: 'stairs-fireplace-refresh', count: 4, ext: 'jpg' },

  { service: 'flooring', title: 'New Flooring Install', location: '', folder: 'new-flooring-install', count: 2, ext: 'jpg' }

  // No projects yet for 'basement' or 'whole-home' — those service pages
  // will just show "Photos coming soon" until you add one here.
];
