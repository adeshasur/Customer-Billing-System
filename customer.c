#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Structure to store the date
struct date {
    int day;
    int month;
    int year;
};

// Structure to store customer account information
struct account {
    int account_number;
    char name[50];
    char address[100];
    char phone[15];
    char email[50];
    char account_type[20];
    float old_balance;
    float payment;
    float new_balance;
    float total_balance;
    struct date last_payment;
};

// Function prototypes
void input();
void writefile();
void search();
void output();
void menu();

// Main function
int main() {
    menu();
    return 0;
}

// Main menu
void menu() {
    int choice;

    while (1) {
        printf("\n===== Customer Billing System =====\n");
        printf("1. Add Customer Record\n");
        printf("2. View All Records\n");
        printf("3. Search Customer\n");
        printf("4. Exit\n");
        printf("Enter your choice: ");
        
        if (scanf("%d", &choice) != 1) {
            printf("Invalid input. Please enter a number.\n");
            while (getchar() != '\n'); // Clear input buffer
            continue;
        }
        getchar(); // to consume newline

        switch (choice) {
            case 1:
                input();
                break;
            case 2:
                output();
                break;
            case 3:
                search();
                break;
            case 4:
                printf("Exiting the system. Goodbye!\n");
                exit(0);
            default:
                printf("Invalid choice. Try again.\n");
        }
    }
}

// Function to add customer record
void input() {
    FILE *fp = fopen("billing.txt", "ab"); // Use binary mode for consistent behavior
    if (fp == NULL) {
        printf("Error opening file!\n");
        return;
    }

    struct account customer;

    printf("\nEnter Account Number: ");
    if (scanf("%d", &customer.account_number) != 1) {
        printf("Invalid account number!\n");
        fclose(fp);
        return;
    }
    getchar();

    printf("Enter Name: ");
    if (fgets(customer.name, 50, stdin) == NULL) {
        printf("Error reading name!\n");
        fclose(fp);
        return;
    }
    customer.name[strcspn(customer.name, "\n")] = '\0';

    printf("Enter Address: ");
    if (fgets(customer.address, 100, stdin) == NULL) {
        printf("Error reading address!\n");
        fclose(fp);
        return;
    }
    customer.address[strcspn(customer.address, "\n")] = '\0';

    printf("Enter Phone: ");
    if (fgets(customer.phone, 15, stdin) == NULL) {
        printf("Error reading phone!\n");
        fclose(fp);
        return;
    }
    customer.phone[strcspn(customer.phone, "\n")] = '\0';

    printf("Enter Email: ");
    if (fgets(customer.email, 50, stdin) == NULL) {
        printf("Error reading email!\n");
        fclose(fp);
        return;
    }
    customer.email[strcspn(customer.email, "\n")] = '\0';

    printf("Enter Account Type (e.g., Savings, Current): ");
    if (fgets(customer.account_type, 20, stdin) == NULL) {
        printf("Error reading account type!\n");
        fclose(fp);
        return;
    }
    customer.account_type[strcspn(customer.account_type, "\n")] = '\0';

    printf("Enter Previous Balance: ");
    if (scanf("%f", &customer.old_balance) != 1) {
        printf("Invalid balance amount!\n");
        fclose(fp);
        return;
    }

    printf("Enter Payment Amount: ");
    if (scanf("%f", &customer.payment) != 1) {
        printf("Invalid payment amount!\n");
        fclose(fp);
        return;
    }

    customer.new_balance = customer.old_balance - customer.payment;
    customer.total_balance = customer.new_balance;

    printf("Enter Last Payment Date (DD MM YYYY): ");
    if (scanf("%d %d %d", &customer.last_payment.day, 
                         &customer.last_payment.month, 
                         &customer.last_payment.year) != 3) {
        printf("Invalid date format!\n");
        fclose(fp);
        return;
    }

    if (fwrite(&customer, sizeof(customer), 1, fp) != 1) {
        printf("Error writing to file!\n");
    } else {
        printf("\n✅ Customer record added successfully!\n");
    }

    fclose(fp);
}

// Function to display all records
void output() {
    FILE *fp = fopen("billing.txt", "rb"); // Use binary mode
    if (fp == NULL) {
        printf("No records found.\n");
        return;
    }

    printf("\n===== Customer Records =====\n");

    struct account customer;
    int records_found = 0;

    while (fread(&customer, sizeof(customer), 1, fp) == 1) {
        records_found = 1;
        printf("\nAccount No: %d\n", customer.account_number);
        printf("Name: %s\n", customer.name);
        printf("Address: %s\n", customer.address);
        printf("Phone: %s\n", customer.phone);
        printf("Email: %s\n", customer.email);
        printf("Account Type: %s\n", customer.account_type);
        printf("Old Balance: %.2f\n", customer.old_balance);
        printf("Payment: %.2f\n", customer.payment);
        printf("New Balance: %.2f\n", customer.new_balance);
        printf("Last Payment Date: %02d-%02d-%04d\n", 
               customer.last_payment.day, 
               customer.last_payment.month, 
               customer.last_payment.year);
    }

    if (!records_found) {
        printf("No customer records found.\n");
    }

    fclose(fp);
}

// Function to search for a customer by account number
void search() {
    int acc_no, found = 0;

    FILE *fp = fopen("billing.txt", "rb");
    if (fp == NULL) {
        printf("No records found.\n");
        return;
    }

    printf("Enter Account Number to search: ");
    if (scanf("%d", &acc_no) != 1) {
        printf("Invalid account number!\n");
        fclose(fp);
        return;
    }

    struct account customer;

    while (fread(&customer, sizeof(customer), 1, fp) == 1) {
        if (customer.account_number == acc_no) {
            found = 1;
            printf("\n✅ Record Found:\n");
            printf("Account No: %d\n", customer.account_number);
            printf("Name: %s\n", customer.name);
            printf("Address: %s\n", customer.address);
            printf("Phone: %s\n", customer.phone);
            printf("Email: %s\n", customer.email);
            printf("Account Type: %s\n", customer.account_type);
            printf("Old Balance: %.2f\n", customer.old_balance);
            printf("Payment: %.2f\n", customer.payment);
            printf("New Balance: %.2f\n", customer.new_balance);
            printf("Last Payment Date: %02d-%02d-%04d\n", 
                   customer.last_payment.day, 
                   customer.last_payment.month, 
                   customer.last_payment.year);
            break;
        }
    }

    if (!found) {
        printf("❌ Record not found.\n");
    }

    fclose(fp);
}