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

struct account customer;

// Function prototypes
void input();
void writefile();
void search();
void output();
void menu();

FILE *fp;

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
        scanf("%d", &choice);
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
    fp = fopen("billing.txt", "a");

    printf("\nEnter Account Number: ");
    scanf("%d", &customer.account_number);
    getchar();

    printf("Enter Name: ");
    fgets(customer.name, 50, stdin);
    customer.name[strcspn(customer.name, "\n")] = 0;

    printf("Enter Address: ");
    fgets(customer.address, 100, stdin);
    customer.address[strcspn(customer.address, "\n")] = 0;

    printf("Enter Phone: ");
    fgets(customer.phone, 15, stdin);
    customer.phone[strcspn(customer.phone, "\n")] = 0;

    printf("Enter Email: ");
    fgets(customer.email, 50, stdin);
    customer.email[strcspn(customer.email, "\n")] = 0;

    printf("Enter Account Type (e.g., Savings, Current): ");
    fgets(customer.account_type, 20, stdin);
    customer.account_type[strcspn(customer.account_type, "\n")] = 0;

    printf("Enter Previous Balance: ");
    scanf("%f", &customer.old_balance);

    printf("Enter Payment Amount: ");
    scanf("%f", &customer.payment);

    customer.new_balance = customer.old_balance - customer.payment;
    customer.total_balance = customer.new_balance;

    printf("Enter Last Payment Date (DD MM YYYY): ");
    scanf("%d %d %d", &customer.last_payment.day, &customer.last_payment.month, &customer.last_payment.year);

    fwrite(&customer, sizeof(customer), 1, fp);
    fclose(fp);

    printf("\n✅ Customer record added successfully!\n");
}

// Function to display all records
void output() {
    fp = fopen("billing.txt", "r");

    if (fp == NULL) {
        printf("No records found.\n");
        return;
    }

    printf("\n===== Customer Records =====\n");

    while (fread(&customer, sizeof(customer), 1, fp)) {
        printf("\nAccount No: %d\n", customer.account_number);
        printf("Name: %s\n", customer.name);
        printf("Address: %s\n", customer.address);
        printf("Phone: %s\n", customer.phone);
        printf("Email: %s\n", customer.email);
        printf("Account Type: %s\n", customer.account_type);
        printf("Old Balance: %.2f\n", customer.old_balance);
        printf("Payment: %.2f\n", customer.payment);
        printf("New Balance: %.2f\n", customer.new_balance);
        printf("Last Payment Date: %02d-%02d-%04d\n", customer.last_payment.day, customer.last_payment.month, customer.last_payment.year);
    }

    fclose(fp);
}

// Function to search for a customer by account number
void search() {
    int acc_no, found = 0;

    fp = fopen("billing.txt", "r");
    if (fp == NULL) {
        printf("No records found.\n");
        return;
    }

    printf("Enter Account Number to search: ");
    scanf("%d", &acc_no);

    while (fread(&customer, sizeof(customer), 1, fp)) {
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
            printf("Last Payment Date: %02d-%02d-%04d\n", customer.last_payment.day, customer.last_payment.month, customer.last_payment.year);
            break;
        }
    }

    if (!found) {
        printf("❌ Record not found.\n");
    }

    fclose(fp);
}
