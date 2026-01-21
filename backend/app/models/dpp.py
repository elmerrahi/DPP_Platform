from dataclasses import dataclass
from typing import Any, Dict
from uuid import UUID


@dataclass
class DPPRecord:
    id: UUID
    owner_id: UUID
    product_name: str
    product_id: str
    data: Dict[str, Any]