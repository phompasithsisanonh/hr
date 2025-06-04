import React from "react";
import {
  Box,
  Flex,
  Grid,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Container,
  Progress,
} from "@chakra-ui/react";
import {
  FiUsers,
  FiUserPlus,
  FiClock,
  FiBell,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const StatCard = ({
  title,
  number,
  subtitle,
  icon,
  iconColor,
  hoverColor,
  trend,
}) => {
  return (
    <Box
      bg="white"
      p={6}
      borderRadius="xl"
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
      border="1px solid"
      borderColor="gray.100"
      transition="all 0.2s"
      _hover={{
        transform: "translateY(-2px)",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        borderColor: hoverColor,
      }}
      cursor="pointer"
    >
      <Flex align="center" justify="space-between">
        <VStack align="start" spacing={2}>
          <Text fontSize="sm" color="gray.600" fontWeight="medium">
            {title}
          </Text>
          <Text fontSize="3xl" fontWeight="bold" color="gray.800">
            {number}
          </Text>
          <HStack spacing={2}>
            <Icon
              as={trend > 0 ? FiTrendingUp : FiTrendingDown}
              color={trend > 0 ? "green.500" : "red.500"}
              w={4}
              h={4}
            />
            <Text fontSize="xs" color={trend > 0 ? "green.500" : "red.500"}>
              {Math.abs(trend)}% {subtitle}
            </Text>
          </HStack>
        </VStack>
        <Box p={3} borderRadius="lg" bg={`${iconColor}.50`}>
          <Icon as={icon} w={6} h={6} color={`${iconColor}.500`} />
        </Box>
      </Flex>
    </Box>
  );
};

const ChartCard = ({ title, children, height = "300px" }) => {
  return (
    <Box
      bg="white"
      p={6}
      borderRadius="xl"
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
      border="1px solid"
      borderColor="gray.100"
    >
      <Text fontSize="lg" fontWeight="semibold" color="gray.800" mb={4}>
        {title}
      </Text>
      <Box height={height}>{children}</Box>
    </Box>
  );
};

export default function HrDashboard() {
  const bgColor = useColorModeValue("#F7FAFC", "gray.800");

  // Sample data for charts
  const employeeGrowthData = [
    { month: "Jan", employees: 180, hires: 12 },
    { month: "Feb", employees: 195, hires: 15 },
    { month: "Mar", employees: 210, hires: 18 },
    { month: "Apr", employees: 225, hires: 20 },
    { month: "May", employees: 247, hires: 23 },
  ];

  const departmentData = [
    { name: "Engineering", value: 85, color: "#3182CE" },
    { name: "Sales", value: 52, color: "#38A169" },
    { name: "Marketing", value: 34, color: "#805AD5" },
    { name: "HR", value: 28, color: "#DD6B20" },
    { name: "Finance", value: 24, color: "#E53E3E" },
    { name: "Operations", value: 24, color: "#00B5D8" },
  ];

  const leaveData = [
    { month: "Jan", approved: 45, pending: 8, rejected: 3 },
    { month: "Feb", approved: 52, pending: 12, rejected: 5 },
    { month: "Mar", approved: 38, pending: 6, rejected: 2 },
    { month: "Apr", approved: 65, pending: 15, rejected: 4 },
    { month: "May", approved: 48, pending: 18, rejected: 6 },
  ];

  const performanceData = [
    { metric: "Employee Satisfaction", score: 88 },
    { metric: "Retention Rate", score: 94 },
    { metric: "Training Completion", score: 76 },
    { metric: "Goal Achievement", score: 82 },
  ];

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Top Navigation */}
      <Box
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        px={6}
        py={4}
        boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1)"
      >
        <Flex align="center">
          <Text fontSize="xl" fontWeight="bold" color="gray.800">
            HR Admin Dashboard
          </Text>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box p={6}>
        <Container maxW="container.xl" px={0}>
          <VStack spacing={8} align="stretch">
            {/* Welcome Section */}
            <Box>
              <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={2}>
                Welcome back, Admin
              </Text>
              <Text color="gray.600">
                Here's what's happening with your team today.
              </Text>
            </Box>

            {/* Statistics Grid */}
            <Grid
              templateColumns={{
                base: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              }}
              gap={6}
            >
              <StatCard
                title="Total Employees"
                number="247"
                subtitle="from last month"
                icon={FiUsers}
                iconColor="blue"
                hoverColor="blue.200"
                trend={12}
              />
              <StatCard
                title="New Hires This Month"
                number="23"
                subtitle="from last month"
                icon={FiUserPlus}
                iconColor="green"
                hoverColor="green.200"
                trend={8}
              />
              <StatCard
                title="Leave Requests"
                number="15"
                subtitle="from last week"
                icon={FiClock}
                iconColor="purple"
                hoverColor="purple.200"
                trend={-5}
              />
              <StatCard
                title="Notifications"
                number="8"
                subtitle="from yesterday"
                icon={FiBell}
                iconColor="orange"
                hoverColor="orange.200"
                trend={3}
              />
            </Grid>

            {/* Charts Row 1 */}
            <Grid
              templateColumns={{
                base: "1fr",
                lg: "2fr 1fr",
              }}
              gap={6}
            >
              <ChartCard title="Employee Growth & Hiring Trends">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={employeeGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" stroke="#A0AEC0" />
                    <YAxis stroke="#A0AEC0" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E2E8F0",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="employees"
                      stroke="#3182CE"
                      strokeWidth={3}
                      name="Total Employees"
                    />
                    <Line
                      type="monotone"
                      dataKey="hires"
                      stroke="#38A169"
                      strokeWidth={3}
                      name="New Hires"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Department Distribution">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </Grid>

            {/* Charts Row 2 */}
            <Grid
              templateColumns={{
                base: "1fr",
                lg: "1fr 1fr",
              }}
              gap={6}
            >
              <ChartCard title="Leave Requests Overview">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leaveData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" stroke="#A0AEC0" />
                    <YAxis stroke="#A0AEC0" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E2E8F0",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="approved" fill="#38A169" name="Approved" />
                    <Bar dataKey="pending" fill="#ED8936" name="Pending" />
                    <Bar dataKey="rejected" fill="#E53E3E" name="Rejected" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Performance Metrics" height="300px">
                <VStack spacing={6} align="stretch">
                  {performanceData.map((item, index) => (
                    <Box key={index}>
                      <Flex justify="space-between" mb={2}>
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color="gray.700"
                        >
                          {item.metric}
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" color="gray.800">
                          {item.score}%
                        </Text>
                      </Flex>
                      <Progress
                        value={item.score}
                        colorScheme={
                          item.score >= 90
                            ? "green"
                            : item.score >= 80
                            ? "blue"
                            : item.score >= 70
                            ? "yellow"
                            : "red"
                        }
                        size="md"
                        borderRadius="full"
                      />
                    </Box>
                  ))}
                </VStack>
              </ChartCard>
            </Grid>

            {/* Full Width Chart */}
            <ChartCard title="Monthly HR Activities Overview" height="350px">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={employeeGrowthData}>
                  <defs>
                    <linearGradient
                      id="colorEmployees"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3182CE" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3182CE" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38A169" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#38A169" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#A0AEC0" />
                  <YAxis stroke="#A0AEC0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="employees"
                    stroke="#3182CE"
                    fillOpacity={1}
                    fill="url(#colorEmployees)"
                    name="Total Employees"
                  />
                  <Area
                    type="monotone"
                    dataKey="hires"
                    stroke="#38A169"
                    fillOpacity={1}
                    fill="url(#colorHires)"
                    name="New Hires"
                  />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}
