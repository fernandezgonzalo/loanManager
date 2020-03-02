import { BigInt, log, Address } from "@graphprotocol/graph-ts"
import {
  Contract,
  Requested,
  Approved,
  Lent,
  Cosigned,
  Canceled,
  ReadedOracle,
  ApprovedRejected,
  ApprovedError,
  ApprovedByCallback,
  ApprovedBySignature,
  CreatorByCallback,
  BorrowerByCallback,
  CreatorBySignature,
  BorrowerBySignature,
  SettledLend,
  SettledCancel
} from "../generated/Contract/Contract"
import { Loan } from "../generated/schema"

export function handleRequested(event: Requested): void {
  let loan_id = event.params._id.toHex()

  let loan = new Loan(loan_id)
  loan.open = true
  loan.approved = event.params._creator == event.params._borrower
  loan.expiration = event.params._expiration
  loan.amount = event.params._amount
  loan.cosigner = "0x0000000000000000000000000000000000000000"
  loan.model = event.params._model.toHexString()
  loan.creator = event.params._creator.toHexString()
  loan.oracle = event.params._oracle.toHexString()
  loan.borrower = event.params._borrower.toHexString()
  loan.loanData = event.params._loanData
  loan.created = event.block.timestamp

  // loan.currency = contract.getCurrency(event.params._id as BigInt).toString()
  loan.status = BigInt.fromI32(0)
  loan.canceled = false
  loan.save()

  log.info("calling getModel({}) function", [loan_id])
  let contract = Contract.bind(Address.fromString("0x39E67f667eD83c8A2DB0b18189FE93f57081b9aE"))
  
  let model = contract.getModel(event.params._id)
  log.info("model = {}", [model.toHexString()])
}

export function handleApproved(event: Approved): void {
  let loan_id = event.params._id.toHex()
  log.info("handleApproved loan_id={}", [loan_id])
  let loan = Loan.load(loan_id)
  loan.approved = true
  loan.save()
}

export function handleLent(event: Lent): void {
  let loan_id = event.params._id.toHex()
  let loan = Loan.load(loan_id)
  loan.lender = event.params._lender.toHexString()
  loan.open = false
  loan.status = BigInt.fromI32(1)
  loan.save()
}

export function handleCosigned(event: Cosigned): void {
  let loan_id = event.params._id.toHex()
  let loan = Loan.load(loan_id)
  loan.cosigner = event.params._cosigner.toHexString()
  loan.save()
}

export function handleCanceled(event: Canceled): void {
  let loan_id = event.params._id.toHex()
  let loan = Loan.load(loan_id)
  loan.canceled = true
  loan.save()
}

export function handleReadedOracle(event: ReadedOracle): void {}

export function handleApprovedRejected(event: ApprovedRejected): void {}

export function handleApprovedError(event: ApprovedError): void {}

export function handleApprovedByCallback(event: ApprovedByCallback): void {}

export function handleApprovedBySignature(event: ApprovedBySignature): void {}

export function handleCreatorByCallback(event: CreatorByCallback): void {}

export function handleBorrowerByCallback(event: BorrowerByCallback): void {}

export function handleCreatorBySignature(event: CreatorBySignature): void {}

export function handleBorrowerBySignature(event: BorrowerBySignature): void {}

export function handleSettledLend(event: SettledLend): void {}

export function handleSettledCancel(event: SettledCancel): void {}
