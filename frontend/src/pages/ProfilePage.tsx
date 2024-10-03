import { Box, Avatar, Typography, Container } from "@mui/material";

export default function ProfilePage() {
    return (
        <Container maxWidth="sm">

            
            <Typography variant="h4" align="center" sx={{ mt: 10 }}>
                Profil
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh">
                <Avatar 
                    alt="Profile Picture"
                    src="https://randomuser.me/api/portraits/men/41.jpg"
                    sx={{ width: 250, height: 250, mb: 3 }}
                />
                <Typography variant="h6" align="center">
                    John Doe
                </Typography>
                <Typography variant="body1" align="center" color="textSecondary">
                    Age: 32
                </Typography>
            </Box>
        </Container>
    );
}