import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { useParams } from 'react-router-dom';
import { db } from '../Firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { CalendarToday, LocationOn, Assignment, AttachMoney, FileCopy, Engineering } from '@mui/icons-material';

// CustomTabPanel component
function CustomTabPanel({ value, index, children }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Main component for displaying tabs
function ProjectAssignedDetails() {
  const [value, setValue] = useState(0);
  const [project, setProject] = useState(null);
  const { projectId } = useParams();
  const department = sessionStorage.getItem('department');

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectRef = doc(db, "projects", department);
        const docSnap = await getDoc(projectRef);

        if (docSnap.exists()) {
          const projectsData = docSnap.data().department_projects;
          const projectDetails = projectsData[projectId];

          if (projectDetails) {
            setProject(projectDetails);
          } else {
            console.log("Project not found!");
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching project details: ", error);
      }
    };

    fetchProjectDetails();
  }, [projectId, department]);

  if (!project) return <Typography>Loading...</Typography>;

  return (
    <Paper>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={(event, newValue) => setValue(newValue)} aria-label="project details tabs">
          <Tab label="Project Info" id="tab-0" aria-controls="tabpanel-0" icon={<Assignment />} iconPosition="start" sx={{fontWeight: "600"}}/>
          <Tab label="Timeline" id="tab-1" aria-controls="tabpanel-1" icon={<CalendarToday />} iconPosition="start" sx={{fontWeight: "600"}}/>
          <Tab label="Team" id="tab-2" aria-controls="tabpanel-2" icon={<Engineering />} iconPosition="start" sx={{fontWeight: "600"}}/>
          <Tab label="Budget" id="tab-3" aria-controls="tabpanel-3" icon={<AttachMoney />} iconPosition="start" sx={{fontWeight: "600"}}/>
          <Tab label="Resources" id="tab-4" aria-controls="tabpanel-4" icon={<LocationOn />} iconPosition="start" sx={{fontWeight: "600"}}/>
          <Tab label="Documents" id="tab-5" aria-controls="tabpanel-5" icon={<FileCopy />} iconPosition="start" sx={{fontWeight: "600"}}/>
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Typography variant="h6" sx={{fontWeight: "600"}}>Project Info</Typography>
        <List>
          <ListItem>
            <ListItemText primary="Project Name" secondary={project.projectName || 'N/A'} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Project ID" secondary={project.projectId || 'N/A'} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Department" secondary={project.department || 'N/A'} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Location" secondary={project.location || 'N/A'} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Description" secondary={project.description || 'N/A'} />
          </ListItem>
        </List>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Typography variant="h6" sx={{fontWeight: "600"}}>Timeline</Typography>
        <List>
          <ListItem>
            <ListItemText primary="Start Date" secondary={project.startDate || 'N/A'} />
          </ListItem>
          <ListItem>
            <ListItemText primary="End Date" secondary={project.endDate || 'N/A'} />
          </ListItem>
        </List>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Typography variant="h6" sx={{fontWeight: "600"}}>Team</Typography>
        <List>
          {project.team && project.team.length > 0 ? (
            project.team.map((member, index) => (
              <ListItem key={index}>
                <ListItemText primary={member.name || 'No name'} secondary={member.role || 'No role'} />
              </ListItem>
            ))
          ) : (
            <Typography>No team members assigned</Typography>
          )}
        </List>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <Typography variant="h6" sx={{fontWeight: "600"}}>Budget</Typography>
        <Typography>{project.budget || 'No budget information available'}</Typography>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <Typography variant="h6" sx={{fontWeight: "600"}}>Resources</Typography>
        <List>
          {project.resources && project.resources.length > 0 ? (
            project.resources.map((resource, index) => (
              <ListItem key={index}>
                <ListItemText primary={resource.itemName || 'No item name'} secondary={`Quantity: ${resource.itemQuantity || 'N/A'}`} />
              </ListItem>
            ))
          ) : (
            <Typography>No resources available</Typography>
          )}
        </List>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <Typography variant="h6" sx={{fontWeight: "600"}}>Documents</Typography>
        <Typography>{project.documents || 'No documents available'}</Typography>
      </CustomTabPanel>
    </Paper>
  );
}

export default ProjectAssignedDetails;
