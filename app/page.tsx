'use client';

import { Box, Button, Center } from "@mantine/core";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  function handleSubmit() { 
    console.log("clicked");
    router.push("/dashboard");
  }

  return (
    <Center>
      <Box>
        <Button onClick={handleSubmit}>
          Create Your Trip
        </Button>
      </Box>
    </Center>
  );
}
  