import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { VacationRequest, VacationRequestStatus } from "../entities/VacationRequest";

const SAMPLE_REQUESTS: Array<{
  email: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: VacationRequestStatus;
  comments?: string;
}> = [
  {
    email: "maya@vacation.local",
    start_date: "2026-11-02",
    end_date: "2026-11-06",
    reason: "Family trip",
    status: "Approved",
  },
  {
    email: "maya@vacation.local",
    start_date: "2027-02-08",
    end_date: "2027-02-12",
    reason: "Ski week",
    status: "Pending",
  },
  {
    email: "maya@vacation.local",
    start_date: "2026-07-14",
    end_date: "2026-07-18",
    reason: "Wedding",
    status: "Rejected",
    comments: "Please pick dates with more notice.",
  },
  {
    email: "noah@vacation.local",
    start_date: "2026-12-21",
    end_date: "2026-12-28",
    reason: "Holiday travel",
    status: "Approved",
  },
  {
    email: "noah@vacation.local",
    start_date: "2027-03-01",
    end_date: "2027-03-05",
    reason: "Conference",
    status: "Pending",
  },
  {
    email: "noah@vacation.local",
    start_date: "2026-09-10",
    end_date: "2026-09-11",
    reason: "Moving day",
    status: "Rejected",
    comments: "Cover is already thin that week.",
  },
  {
    email: "sofia@vacation.local",
    start_date: "2026-11-16",
    end_date: "2026-11-20",
    reason: "City break",
    status: "Approved",
  },
  {
    email: "sofia@vacation.local",
    start_date: "2027-01-04",
    end_date: "2027-01-08",
    reason: "New year rest",
    status: "Pending",
  },
  {
    email: "sofia@vacation.local",
    start_date: "2026-05-04",
    end_date: "2026-05-08",
    reason: "Spring holiday",
    status: "Rejected",
    comments: "Peak delivery week.",
  },
  {
    email: "liam@vacation.local",
    start_date: "2026-12-01",
    end_date: "2026-12-03",
    reason: "Long weekend",
    status: "Approved",
  },
  {
    email: "liam@vacation.local",
    start_date: "2027-04-12",
    end_date: "2027-04-16",
    reason: "Visit family",
    status: "Pending",
  },
  {
    email: "liam@vacation.local",
    start_date: "2026-08-24",
    end_date: "2026-08-28",
    reason: "Summer leave",
    status: "Rejected",
    comments: "Too many overlapping requests.",
  },
  {
    email: "emma@vacation.local",
    start_date: "2026-10-26",
    end_date: "2026-10-30",
    reason: "Medical",
    status: "Approved",
  },
  {
    email: "emma@vacation.local",
    start_date: "2027-05-10",
    end_date: "2027-05-14",
    reason: "Graduation",
    status: "Pending",
  },
  {
    email: "emma@vacation.local",
    start_date: "2026-06-15",
    end_date: "2026-06-19",
    reason: "Festival",
    status: "Rejected",
    comments: "Please use remaining days later in the year.",
  },
  {
    email: "requester@vacation.local",
    start_date: "2026-04-07",
    end_date: "2026-04-09",
    reason: "Long weekend",
    status: "Rejected",
    comments: "Sprint demo that week.",
  },
];

export async function seedSampleRequests(): Promise<void> {
  const requestRepository = AppDataSource.getRepository(VacationRequest);
  const existingCount = await requestRepository.count();

  if (existingCount >= 12) {
    return;
  }

  const userRepository = AppDataSource.getRepository(User);
  let added = 0;

  for (const sample of SAMPLE_REQUESTS) {
    const owner = await userRepository.findOne({ where: { email: sample.email } });
    if (!owner) {
      continue;
    }

    const alreadyThere = await requestRepository.findOne({
      where: {
        user_id: owner.id,
        start_date: sample.start_date,
        end_date: sample.end_date,
      },
    });

    if (alreadyThere) {
      continue;
    }

    await requestRepository.save(
      requestRepository.create({
        user_id: owner.id,
        start_date: sample.start_date,
        end_date: sample.end_date,
        reason: sample.reason,
        status: sample.status,
        comments: sample.comments ?? null,
      })
    );
    added += 1;
  }

  if (added > 0) {
    console.log(`Seeded ${added} sample vacation request(s)`);
  }
}
