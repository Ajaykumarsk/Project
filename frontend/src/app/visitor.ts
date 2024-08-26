export interface Visitor {
  visitor_pass_no: string;
  badge_id: string;
  visitor_name: string;
  mobile_no: string;
  email: string;
  designation: string;
  department: string;
  nationality: string;
  total_visitor: number;
  company_name: string;
  company_contact_no: string;
  company_address: string;
  area_to_visit: string;
  type_of_visitor: string;
  meeting_purpose: string;
  id_proof: string;
  id_proof_number: string;
  valid_pass_from: Date;
  valid_pass_to: Date;
  visitor_status: string;
  expecting_stay_hours: number;
  select_employee: string;
  host_department: string;
  host_email_id: string;
  host_contact_details: string;
  item_caring: string;
  make_serial_no: string;
  visitor_photo?: string | File;
  id_proof_photo?: string | File;
  vehicle_number?: string;
  vehicle_type?: string;
  checkin: boolean;
  checkedIn: boolean;
  checkedOut: boolean;
  check_in_time?: Date; // Define as Date
  check_out_time?: Date; // Define as Date
  is_verified :boolean;
  is_approved:boolean;
  created:Date;
  modified:Date;
}
